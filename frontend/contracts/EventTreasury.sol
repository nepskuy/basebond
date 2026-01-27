// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title EventTreasury
 * @dev Community treasury for BaseBond - holds event fees and enables governance
 * Implements Layer 3 of IDRX Integration: Treasury Management
 */
contract EventTreasury is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public idrxToken;
    
    // Treasury balance tracking
    uint256 public totalDeposits;
    
    // Fee configuration (in basis points, 100 = 1%)
    uint256 public platformFeeBps = 250; // 2.5% default platform fee
    uint256 public constant MAX_FEE_BPS = 1000; // Max 10%

    // Governance proposals
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        address recipient;
        uint256 amount;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
        bool cancelled;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    // Voting power based on IDRX holdings
    uint256 public minProposalThreshold = 1000e18; // Min 1000 IDRX to propose
    uint256 public votingPeriod = 3 days;
    uint256 public quorumBps = 1000; // 10% quorum required

    // Event organizer balances (their share of ticket sales)
    mapping(address => uint256) public organizerBalances;

    // Events
    event Deposited(address indexed from, uint256 amount, uint256 eventId);
    event Withdrawn(address indexed to, uint256 amount);
    event OrganizerWithdrew(address indexed organizer, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);
    event FeeUpdated(uint256 newFeeBps);

    constructor(address _idrxToken) Ownable(msg.sender) {
        idrxToken = IERC20(_idrxToken);
    }

    // ============ DEPOSIT FUNCTIONS ============

    /**
     * @dev Deposit IDRX from ticket sales with fee split
     * @param amount Total amount from ticket sale
     * @param eventId Event identifier for tracking
     * @param organizer Event organizer address
     */
    function depositFromTicketSale(
        uint256 amount, 
        uint256 eventId, 
        address organizer
    ) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        
        idrxToken.safeTransferFrom(msg.sender, address(this), amount);
        
        // Calculate fee split
        uint256 platformFee = (amount * platformFeeBps) / 10000;
        uint256 organizerShare = amount - platformFee;
        
        // Platform fee goes to treasury
        totalDeposits += platformFee;
        
        // Organizer share is tracked separately
        organizerBalances[organizer] += organizerShare;
        
        emit Deposited(msg.sender, amount, eventId);
    }

    /**
     * @dev Direct deposit to treasury (donations, etc.)
     */
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        idrxToken.safeTransferFrom(msg.sender, address(this), amount);
        totalDeposits += amount;
        emit Deposited(msg.sender, amount, 0);
    }

    // ============ WITHDRAWAL FUNCTIONS ============

    /**
     * @dev Organizers withdraw their earned balance
     */
    function withdrawOrganizerBalance() external nonReentrant {
        uint256 balance = organizerBalances[msg.sender];
        require(balance > 0, "No balance to withdraw");
        
        organizerBalances[msg.sender] = 0;
        idrxToken.safeTransfer(msg.sender, balance);
        
        emit OrganizerWithdrew(msg.sender, balance);
    }

    // ============ GOVERNANCE FUNCTIONS ============

    /**
     * @dev Create a proposal to spend treasury funds
     * Requires minimum IDRX holdings
     */
    function createProposal(
        string calldata description,
        address recipient,
        uint256 amount
    ) external returns (uint256) {
        require(
            idrxToken.balanceOf(msg.sender) >= minProposalThreshold,
            "Insufficient IDRX to propose"
        );
        require(amount <= totalDeposits, "Amount exceeds treasury");
        require(recipient != address(0), "Invalid recipient");

        proposalCount++;
        
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            proposer: msg.sender,
            description: description,
            recipient: recipient,
            amount: amount,
            votesFor: 0,
            votesAgainst: 0,
            deadline: block.timestamp + votingPeriod,
            executed: false,
            cancelled: false
        });

        emit ProposalCreated(proposalCount, msg.sender, description);
        return proposalCount;
    }

    /**
     * @dev Vote on a proposal with IDRX balance as voting weight
     */
    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.id != 0, "Proposal doesn't exist");
        require(block.timestamp < proposal.deadline, "Voting ended");
        require(!proposal.executed, "Already executed");
        require(!proposal.cancelled, "Proposal cancelled");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        uint256 weight = idrxToken.balanceOf(msg.sender);
        require(weight > 0, "No voting power");

        hasVoted[proposalId][msg.sender] = true;

        if (support) {
            proposal.votesFor += weight;
        } else {
            proposal.votesAgainst += weight;
        }

        emit Voted(proposalId, msg.sender, support, weight);
    }

    /**
     * @dev Execute a passed proposal
     */
    function executeProposal(uint256 proposalId) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.id != 0, "Proposal doesn't exist");
        require(block.timestamp >= proposal.deadline, "Voting not ended");
        require(!proposal.executed, "Already executed");
        require(!proposal.cancelled, "Proposal cancelled");
        
        // Check if quorum reached and votes passed
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        uint256 totalSupply = idrxToken.totalSupply();
        uint256 quorumRequired = (totalSupply * quorumBps) / 10000;
        
        require(totalVotes >= quorumRequired, "Quorum not reached");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal rejected");
        require(proposal.amount <= totalDeposits, "Insufficient treasury");

        proposal.executed = true;
        totalDeposits -= proposal.amount;
        
        idrxToken.safeTransfer(proposal.recipient, proposal.amount);
        
        emit ProposalExecuted(proposalId);
    }

    /**
     * @dev Cancel a proposal (only proposer or owner)
     */
    function cancelProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(
            msg.sender == proposal.proposer || msg.sender == owner(),
            "Not authorized"
        );
        require(!proposal.executed, "Already executed");
        
        proposal.cancelled = true;
        emit ProposalCancelled(proposalId);
    }

    // ============ ADMIN FUNCTIONS ============

    function setPlatformFee(uint256 _feeBps) external onlyOwner {
        require(_feeBps <= MAX_FEE_BPS, "Fee too high");
        platformFeeBps = _feeBps;
        emit FeeUpdated(_feeBps);
    }

    function setMinProposalThreshold(uint256 _threshold) external onlyOwner {
        minProposalThreshold = _threshold;
    }

    function setVotingPeriod(uint256 _period) external onlyOwner {
        votingPeriod = _period;
    }

    function setQuorum(uint256 _quorumBps) external onlyOwner {
        require(_quorumBps <= 5000, "Quorum too high"); // Max 50%
        quorumBps = _quorumBps;
    }

    /**
     * @dev Emergency withdrawal by owner (for security issues)
     */
    function emergencyWithdraw(address to, uint256 amount) external onlyOwner {
        require(amount <= idrxToken.balanceOf(address(this)), "Insufficient balance");
        idrxToken.safeTransfer(to, amount);
        emit Withdrawn(to, amount);
    }

    // ============ VIEW FUNCTIONS ============

    function getTreasuryBalance() external view returns (uint256) {
        return idrxToken.balanceOf(address(this));
    }

    function getProposal(uint256 proposalId) external view returns (
        address proposer,
        string memory description,
        address recipient,
        uint256 amount,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 deadline,
        bool executed,
        bool cancelled
    ) {
        Proposal memory p = proposals[proposalId];
        return (
            p.proposer,
            p.description,
            p.recipient,
            p.amount,
            p.votesFor,
            p.votesAgainst,
            p.deadline,
            p.executed,
            p.cancelled
        );
    }
}

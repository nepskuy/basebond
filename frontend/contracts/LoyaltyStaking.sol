// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LoyaltyStaking
 * @dev Stake IDRX tokens to earn Event Points for the BaseBond ecosystem
 * Implements Layer 1 of IDRX Integration: Loyalty Points System
 */
contract LoyaltyStaking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public idrxToken;
    
    // Staking configuration
    uint256 public pointsPerTokenPerDay = 100; // 100 points per IDRX per day
    uint256 public minStakeAmount = 1e18; // Minimum 1 IDRX
    uint256 public constant PRECISION = 1e18;

    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 claimedPoints;
    }

    // User staking data
    mapping(address => StakeInfo) public stakes;
    
    // User accumulated points (total earned - used)
    mapping(address => uint256) public eventPoints;
    
    // Total staked across all users
    uint256 public totalStaked;

    // Authorized point distributors (EventFactory can reward check-ins)
    mapping(address => bool) public authorizedDistributors;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event PointsClaimed(address indexed user, uint256 points);
    event PointsAwarded(address indexed user, uint256 points, string reason);
    event PointsSpent(address indexed user, uint256 points, string purpose);
    event DistributorUpdated(address indexed distributor, bool authorized);

    constructor(address _idrxToken) Ownable(msg.sender) {
        idrxToken = IERC20(_idrxToken);
    }

    // ============ STAKING FUNCTIONS ============

    /**
     * @dev Stake IDRX tokens to earn points
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount >= minStakeAmount, "Below minimum stake");
        
        // Claim any pending points before modifying stake
        if (stakes[msg.sender].amount > 0) {
            _claimPoints(msg.sender);
        }

        idrxToken.safeTransferFrom(msg.sender, address(this), amount);
        
        stakes[msg.sender].amount += amount;
        stakes[msg.sender].startTime = block.timestamp;
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    /**
     * @dev Unstake IDRX tokens
     */
    function unstake(uint256 amount) external nonReentrant {
        require(stakes[msg.sender].amount >= amount, "Insufficient stake");
        
        // Claim pending points before unstaking
        _claimPoints(msg.sender);

        stakes[msg.sender].amount -= amount;
        totalStaked -= amount;

        idrxToken.safeTransfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    /**
     * @dev Claim accumulated points from staking
     */
    function claimPoints() external nonReentrant {
        _claimPoints(msg.sender);
    }

    function _claimPoints(address user) internal {
        uint256 pending = pendingPoints(user);
        if (pending > 0) {
            eventPoints[user] += pending;
            stakes[user].claimedPoints += pending;
            stakes[user].startTime = block.timestamp;
            emit PointsClaimed(user, pending);
        }
    }

    /**
     * @dev Calculate pending points for a user
     */
    function pendingPoints(address user) public view returns (uint256) {
        StakeInfo memory stakeInfo = stakes[user];
        if (stakeInfo.amount == 0) return 0;

        uint256 duration = block.timestamp - stakeInfo.startTime;
        uint256 daysStaked = duration / 1 days;
        
        // Points = (stakedAmount / 1e18) * daysStaked * pointsPerTokenPerDay
        return (stakeInfo.amount * daysStaked * pointsPerTokenPerDay) / PRECISION;
    }

    // ============ POINTS DISTRIBUTION ============

    /**
     * @dev Award bonus points (for check-in, participation, etc.)
     * Can only be called by authorized distributors
     */
    function awardPoints(address user, uint256 points, string calldata reason) external {
        require(authorizedDistributors[msg.sender] || msg.sender == owner(), "Not authorized");
        eventPoints[user] += points;
        emit PointsAwarded(user, points, reason);
    }

    /**
     * @dev Batch award points to multiple users
     */
    function batchAwardPoints(
        address[] calldata users, 
        uint256[] calldata points, 
        string calldata reason
    ) external {
        require(authorizedDistributors[msg.sender] || msg.sender == owner(), "Not authorized");
        require(users.length == points.length, "Array length mismatch");
        
        for (uint256 i = 0; i < users.length; i++) {
            eventPoints[users[i]] += points[i];
            emit PointsAwarded(users[i], points[i], reason);
        }
    }

    // ============ POINTS REDEMPTION ============

    /**
     * @dev Spend points for rewards/merchandise
     * Called by authorized contracts (e.g., marketplace)
     */
    function spendPoints(address user, uint256 points, string calldata purpose) external {
        require(authorizedDistributors[msg.sender] || msg.sender == owner(), "Not authorized");
        require(eventPoints[user] >= points, "Insufficient points");
        
        eventPoints[user] -= points;
        emit PointsSpent(user, points, purpose);
    }

    // ============ ADMIN FUNCTIONS ============

    function setPointsPerTokenPerDay(uint256 _points) external onlyOwner {
        pointsPerTokenPerDay = _points;
    }

    function setMinStakeAmount(uint256 _amount) external onlyOwner {
        minStakeAmount = _amount;
    }

    function setAuthorizedDistributor(address distributor, bool authorized) external onlyOwner {
        authorizedDistributors[distributor] = authorized;
        emit DistributorUpdated(distributor, authorized);
    }

    // ============ VIEW FUNCTIONS ============

    function getStakeInfo(address user) external view returns (
        uint256 stakedAmount,
        uint256 stakingStartTime,
        uint256 claimedPoints,
        uint256 pendingPointsAmount,
        uint256 totalPoints
    ) {
        StakeInfo memory info = stakes[user];
        return (
            info.amount,
            info.startTime,
            info.claimedPoints,
            pendingPoints(user),
            eventPoints[user]
        );
    }
}

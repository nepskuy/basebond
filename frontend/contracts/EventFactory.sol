// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./TicketNFT.sol";
import "./EventPOAP.sol";

interface ILoyaltyStaking {
    function awardPoints(address user, uint256 points, string calldata reason) external;
    function batchAwardPoints(address[] calldata users, uint256[] calldata points, string calldata reason) external;
}

contract EventFactory is Ownable, ReentrancyGuard {
    struct Event {
        uint256 id;
        string name;
        string description;
        string location;
        uint256 date;
        uint256 price; 
        uint256 maxTickets;
        uint256 soldTickets;
        address organizer;
        bool isActive;
    }

    uint256 private _eventIdCounter;
    mapping(uint256 => Event) public events;
    mapping(uint256 => mapping(address => bool)) public hasTicket;
    mapping(uint256 => mapping(address => bool)) public hasCheckedIn;
    
    TicketNFT public ticketContract;
    EventPOAP public poapContract;
    ILoyaltyStaking public loyaltyStaking;
    
    // Points awarded on check-in
    uint256 public checkInRewardPoints = 100;

    event EventCreated(uint256 indexed eventId, string name, address indexed organizer);
    event TicketPurchased(uint256 indexed eventId, address indexed buyer, uint256 ticketId);
    event CheckedIn(uint256 indexed eventId, address indexed attendee);
    event BatchCheckedIn(uint256 indexed eventId, uint256 count);
    event EventUpdated(uint256 indexed eventId);
    event EventDeactivated(uint256 indexed eventId);

    constructor(address _ticketContract, address _poapContract) Ownable(msg.sender) {
        ticketContract = TicketNFT(_ticketContract);
        poapContract = EventPOAP(_poapContract);
    }

    // ============ EVENT MANAGEMENT ============

    function createEvent(
        string memory name,
        string memory description,
        string memory location,
        uint256 date,
        uint256 price,
        uint256 maxTickets
    ) public returns (uint256) {
        uint256 eventId = _eventIdCounter++;
        events[eventId] = Event({
            id: eventId,
            name: name,
            description: description,
            location: location,
            date: date,
            price: price,
            maxTickets: maxTickets,
            soldTickets: 0,
            organizer: msg.sender,
            isActive: true
        });
        
        emit EventCreated(eventId, name, msg.sender);
        return eventId;
    }

    // Backward compatible simple createEvent
    function createEvent(string memory name, uint256 date, uint256 price) public returns (uint256) {
        return createEvent(name, "", "", date, price, 0);
    }

    function updateEvent(
        uint256 eventId,
        string memory name,
        string memory description,
        string memory location,
        uint256 date
    ) public {
        Event storage evt = events[eventId];
        require(msg.sender == evt.organizer || msg.sender == owner(), "Not authorized");
        require(evt.isActive, "Event not active");
        
        evt.name = name;
        evt.description = description;
        evt.location = location;
        evt.date = date;
        
        emit EventUpdated(eventId);
    }

    function deactivateEvent(uint256 eventId) public {
        Event storage evt = events[eventId];
        require(msg.sender == evt.organizer || msg.sender == owner(), "Not authorized");
        evt.isActive = false;
        emit EventDeactivated(eventId);
    }

    // ============ TICKET FUNCTIONS ============

    function buyTicket(uint256 eventId) public payable nonReentrant {
        Event storage evt = events[eventId];
        require(evt.isActive, "Event not active");
        require(!hasTicket[eventId][msg.sender], "Already has ticket");
        
        if (evt.maxTickets > 0) {
            require(evt.soldTickets < evt.maxTickets, "Sold out");
        }
        
        if (evt.price > 0) {
            require(msg.value >= evt.price, "Insufficient payment");
            
            // Refund excess
            if (msg.value > evt.price) {
                payable(msg.sender).transfer(msg.value - evt.price);
            }
            
            // Transfer to organizer
            payable(evt.organizer).transfer(evt.price);
        }
        
        // Mint Ticket NFT
        ticketContract.mintTicket(msg.sender, "", eventId);
        
        hasTicket[eventId][msg.sender] = true;
        evt.soldTickets++;
        
        emit TicketPurchased(eventId, msg.sender, evt.soldTickets);
    }
    
    // ============ CHECK-IN FUNCTIONS ============

    function checkIn(uint256 eventId, address attendee) public nonReentrant {
        _checkIn(eventId, attendee);
    }

    function batchCheckIn(uint256 eventId, address[] calldata attendees) public nonReentrant {
        Event memory evt = events[eventId];
        require(msg.sender == evt.organizer || msg.sender == owner(), "Not authorized");
        
        uint256 checkInCount = 0;
        uint256[] memory pointsArray = new uint256[](attendees.length);
        address[] memory validAttendees = new address[](attendees.length);
        uint256 validCount = 0;
        
        for (uint256 i = 0; i < attendees.length; i++) {
            if (!hasCheckedIn[eventId][attendees[i]]) {
                hasCheckedIn[eventId][attendees[i]] = true;
                
                // Mint POAP
                poapContract.mint(attendees[i], eventId, 1, "");
                
                validAttendees[validCount] = attendees[i];
                pointsArray[validCount] = checkInRewardPoints;
                validCount++;
                checkInCount++;
                
                emit CheckedIn(eventId, attendees[i]);
            }
        }
        
        // Batch award points if loyalty staking is configured
        if (address(loyaltyStaking) != address(0) && validCount > 0) {
            // Resize arrays to valid count
            address[] memory finalAttendees = new address[](validCount);
            uint256[] memory finalPoints = new uint256[](validCount);
            for (uint256 i = 0; i < validCount; i++) {
                finalAttendees[i] = validAttendees[i];
                finalPoints[i] = pointsArray[i];
            }
            
            loyaltyStaking.batchAwardPoints(finalAttendees, finalPoints, "Event Check-in");
        }
        
        emit BatchCheckedIn(eventId, checkInCount);
    }

    function _checkIn(uint256 eventId, address attendee) internal {
        Event memory evt = events[eventId];
        require(msg.sender == evt.organizer || msg.sender == owner(), "Not authorized");
        require(!hasCheckedIn[eventId][attendee], "Already checked in");
        
        hasCheckedIn[eventId][attendee] = true;
        
        // Mint POAP (Soulbound)
        poapContract.mint(attendee, eventId, 1, "");
        
        // Award loyalty points
        if (address(loyaltyStaking) != address(0)) {
            loyaltyStaking.awardPoints(attendee, checkInRewardPoints, "Event Check-in");
        }
        
        emit CheckedIn(eventId, attendee);
    }

    // ============ ADMIN FUNCTIONS ============

    function setLoyaltyStaking(address _loyaltyStaking) external onlyOwner {
        loyaltyStaking = ILoyaltyStaking(_loyaltyStaking);
    }

    function setCheckInRewardPoints(uint256 _points) external onlyOwner {
        checkInRewardPoints = _points;
    }

    // ============ VIEW FUNCTIONS ============

    function getEventDetails(uint256 eventId) external view returns (
        string memory name,
        string memory description,
        string memory location,
        uint256 date,
        uint256 price,
        uint256 maxTickets,
        uint256 soldTickets,
        address organizer,
        bool isActive
    ) {
        Event memory evt = events[eventId];
        return (
            evt.name,
            evt.description,
            evt.location,
            evt.date,
            evt.price,
            evt.maxTickets,
            evt.soldTickets,
            evt.organizer,
            evt.isActive
        );
    }

    function getEventCount() external view returns (uint256) {
        return _eventIdCounter;
    }

    function hasUserTicket(uint256 eventId, address user) external view returns (bool) {
        return hasTicket[eventId][user];
    }

    function hasUserCheckedIn(uint256 eventId, address user) external view returns (bool) {
        return hasCheckedIn[eventId][user];
    }
}

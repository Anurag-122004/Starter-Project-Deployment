// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public _OWNER;
    uint256 public balanceofAccount;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event Transfer(address indexed recipient, uint256 amount);

    constructor(uint initBalance) payable {
        _OWNER = payable(msg.sender);
        balanceofAccount = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balanceofAccount;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balanceofAccount;
        require(msg.sender == _OWNER, "You are not the owner of this account");
        balanceofAccount += _amount;
        assert(balanceofAccount == _previousBalance + _amount);
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balanceofAccount, uint256 withdrawingsomeAmount);

    function withdraw(uint256 withdrawingsomeAmount) public {
        require(msg.sender == _OWNER, "You are not the owner of this account");
        uint _previousBalance = balanceofAccount;
        if (balanceofAccount < withdrawingsomeAmount) {
            revert InsufficientBalance({
                balanceofAccount: balanceofAccount,
                withdrawingsomeAmount : withdrawingsomeAmount
            });
        }

        // withdraw the given amount
        balanceofAccount -= withdrawingsomeAmount;

        // assert the balanceofAccount is correct
        assert(balanceofAccount == (_previousBalance - withdrawingsomeAmount));

        // emit the event
        emit Withdraw(withdrawingsomeAmount);
    }

    function transferFundstoReceiver(address _recipient, uint256 _amount) public {
        require(msg.sender == _OWNER, "You are not the owner of this account");
        require(_amount <= balanceofAccount, "Insufficient balance for transfer");
        balanceofAccount -= _amount;
        payable(_recipient).transfer(_amount);
        emit Transfer(_recipient, _amount);
    }

    function getOwnerAddress() public view returns (address) {
        return _OWNER;
    }
}

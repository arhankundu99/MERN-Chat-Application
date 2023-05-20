const asyncHandler = require('express-async-handler')
const chatModel = require('../models/chat')
const userModel = require('../models/user')


const createChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        throw new Error("UserId cannot be empty.");
    }

    // find the chat which has both the users
    let chat = await chatModel.findOne({
        isGroupChat: false,
        $and: [
            {
                users: {
                    $elemMatch: {
                        $eq: req.userId
                    }
                }
            },
            {
                users: {
                    $elemMatch: {
                        $eq: userId
                    }
                }
            }
        ]
    }).populate("users", "-password").populate("latestMessage"); // populate the users except the password field

    chat = await userModel.populate(chat, {
        path: "latestMessage.sender",
        select: "name pic email"
    })

    if (chat) {
        return res.status(200).send(chat);
    }

    let newChat = await chatModel.create({
        chatName: "sender",
        isGroupChat: false,
        users: [req.userId, userId],
        groupAdmin: req.userId
    });

    newChat = await chatModel.findOne({
        _id: newChat._id
    }).populate("users", "-password").populate("groupAdmin", "-password");

    if (newChat) {
        return res.status(200).send(newChat);
    }
    else {
        res.status(400);
        throw new Error("Error while creating chat.");
    }
});

const getChats = asyncHandler(async (req, res) => {
    try {
        let chatsOfLoggedInUser = await chatModel.find({
            users: {
                $elemMatch: {
                    $eq: req.userId
                }
            }
        }).populate("users", "-password")
            .populate("latestMessage")
            .populate("groupAdmin", "-password")
            .sort({ updatedAt: -1 });

        chatsOfLoggedInUser = await userModel.populate(chatsOfLoggedInUser, {
            path: "latestMessage.sender",
            select: "name pic email"
        })

        if (chatsOfLoggedInUser) {
            return res.status(200).send(chatsOfLoggedInUser)
        }
    }
    catch (e) {

        res.status(400);
        throw new Error("No chats for the logged in user.");
    }
});

const renameGroupChat = asyncHandler(async (req, res) => {
    const { groupId, newGroupName } = req.body;
    let chat = await chatModel.findOneAndUpdate({
        _id: groupId,
        isGroupChat: true
    }, {
        chatName: newGroupName
    }).populate("users", "-password").populate("latestMessage"); // populate the users except the password field

    chat = await userModel.populate(chat, {
        path: "latestMessage.sender",
        select: "name pic email"
    });

    if (chat) {
        return res.status(200).send(chat);
    }

    res.status(400);
    throw new Error("Unable to rename group chat.");
});

const createGroupChat = asyncHandler(async (req, res) => {
    const { groupName, userIds } = req.body
  
    if (!groupName || !userIds) {
        return res.status(400).send("group name and user ids cannot be empty.");
    }

    if (userIds.length < 2) {
        return res.status(400).send("More than 2 users are required to form a group chat.");
    }

    // add the logged in user also
    userIds.push(req.userId);

    try {
        let groupChat = await chatModel.create({
            chatName: groupName,
            users: userIds,
            isGroupChat: true,
            groupAdmin: req.userId
        });

        groupChat = await chatModel.findOne({
            _id: groupChat._id
        }).populate("users", "-password").populate("groupAdmin", "-password");

        res.status(200).send(groupChat);
    }
    catch (e) {
        res.status(400).send("Unable to create group chat.");
    }
});

const removeGroupChat = asyncHandler(async (req, res) => {
    const { groupId } = req.body;

    try {
        const groupChat = await chatModel.findOne({
            _id: groupId
        }).populate("users", "-password").populate("groupAdmin", "-password");

        if (groupChat.groupAdmin._id == req.userId) {
            await chatModel.deleteOne({
                _id: groupId
            });

            return res.status(200).send(groupChat);
        }
        return res.status(400).send("Unable to delete the group chat.");
    }
    catch (e) {
        return res.status(400).send("Unable to delete the group chat.");
    }
});

const removeUser = asyncHandler(async (req, res) => {
    const { userId, groupId } = req.body;

    try {
        let groupChat = await chatModel.findOne({
            _id: groupId
        }).populate("users", "-password").populate("groupAdmin", "-password");

        if (groupChat.groupAdmin._id == req.userId) {
            groupChat = await chatModel.findByIdAndUpdate(
                {
                _id: groupId
                },
                {
                    $pull: {
                        users: userId
                    }
                },
                {
                    new: true
                }
            );
            return res.status(200).send(groupChat);
        }
        return res.status(400).send("Unable to add the user in the group chat.");
    }
    catch (e) {
        return res.status(400).send("Unable to add the user in the group chat.");
    }

});

const addUser = asyncHandler(async (req, res) => {
    const { userId, groupId } = req.body;

    try {
        let groupChat = await chatModel.findOne({
            _id: groupId
        }).populate("users", "-password").populate("groupAdmin", "-password");

        if (groupChat.groupAdmin._id == req.userId) {
            groupChat = await chatModel.findByIdAndUpdate(
                {
                _id: groupId
                },
                {
                    $push: {
                        users: userId
                    }
                },
                {
                    new: true
                }
            );
            return res.status(200).send(groupChat);
        }
        return res.status(400).send("Unable to add the user in the group chat.");
    }
    catch (e) {
        return res.status(400).send("Unable to add the user in the group chat.");
    }
});

module.exports = {
    createChat,
    getChats,
    createGroupChat,
    renameGroupChat,
    removeGroupChat,
    removeUser,
    addUser
}
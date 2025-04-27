import { Request, Response } from 'express';
import prisma from '../db/prisma.js';

const sendMessage = async (req:Request, res:Response) => {
  try {
    const { id: receiverId } = req.params;
    const { message } = req.body;
    const senderId = req.user.id; // Assuming you have user info in req.user

    let conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [senderId, receiverId],
        },
        },
    });

    // the very first message between two users
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantIds: {
            set: [senderId, receiverId],
          },
        },
      });
    }
 
    const newMessage = await prisma.message.create({
        data: {
            senderId,
            body : message,
            conversationId: conversation.id,
        }
    });

    if(newMessage) {
        conversation = await prisma.conversation.update({
            where: { id: conversation.id },
            data: {
              messages: {
                connect: { id: newMessage.id }, 
            },
            },
        });
    };

    // soket.io emit to the receiver

    res.status(201).json(newMessage)
  } catch (error: any) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}

const getMessages = async (req:Request, res:Response) => {
    try {
    const {id:userToChatId} = req.params;
    const senderId = req.user.id; // Assuming you have user info in req.user

    const conversation = await prisma.conversation.findFirst({
        where: {
            participantIds: {
                hasEvery: [senderId, userToChatId],
            },
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: 'asc',
                },
            },
        },
    });

    if (!conversation) {
        return res.status(200).json([]);   
    }
   res.status(200).json(conversation.messages);
    } catch (error: any) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
}


export {sendMessage, getMessages};
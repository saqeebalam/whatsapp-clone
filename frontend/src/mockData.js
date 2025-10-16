export const mockContacts = [
  {
    id: 1,
    name: "Mom",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mom",
    lastMessage: "Don't forget to call me tonight!",
    timestamp: "19:45",
    unread: 2,
    online: true
  },
  {
    id: 2,
    name: "Work Team",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=WorkTeam",
    lastMessage: "Meeting at 3 PM tomorrow",
    timestamp: "18:30",
    unread: 0,
    online: false
  },
  {
    id: 3,
    name: "John Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    lastMessage: "See you at the gym!",
    timestamp: "17:22",
    unread: 0,
    online: false
  },
  {
    id: 4,
    name: "Sarah Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    lastMessage: "Thanks for your help 😊",
    timestamp: "16:15",
    unread: 0,
    online: true
  },
  {
    id: 5,
    name: "Pizza Palace",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pizza",
    lastMessage: "Your order is on the way!",
    timestamp: "15:00",
    unread: 0,
    online: false
  },
  {
    id: 6,
    name: "Best Friends",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BestFriends",
    lastMessage: "Mike: Let's plan for the weekend",
    timestamp: "14:30",
    unread: 5,
    online: false
  },
  {
    id: 7,
    name: "Dad",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dad",
    lastMessage: "Proud of you, son!",
    timestamp: "Yesterday",
    unread: 0,
    online: false
  },
  {
    id: 8,
    name: "Emily Parker",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    lastMessage: "Can you send me those photos?",
    timestamp: "Yesterday",
    unread: 0,
    online: true
  }
];

export const mockMessages = {
  1: [
    {
      id: 1,
      text: "Hi honey! How was your day?",
      sender: "them",
      timestamp: "18:30",
      status: "read"
    },
    {
      id: 2,
      text: "It was great, Mom! Had a productive day at work.",
      sender: "me",
      timestamp: "18:35",
      status: "read"
    },
    {
      id: 3,
      text: "That's wonderful to hear! Did you eat lunch?",
      sender: "them",
      timestamp: "18:36",
      status: "read"
    },
    {
      id: 4,
      text: "Yes, I did. Had a nice salad.",
      sender: "me",
      timestamp: "18:40",
      status: "read"
    },
    {
      id: 5,
      text: "Don't forget to call me tonight!",
      sender: "them",
      timestamp: "19:45",
      status: "delivered"
    }
  ],
  2: [
    {
      id: 1,
      text: "Hey everyone, quick reminder about tomorrow's meeting",
      sender: "them",
      timestamp: "17:00",
      status: "read"
    },
    {
      id: 2,
      text: "What time is it again?",
      sender: "me",
      timestamp: "17:05",
      status: "read"
    },
    {
      id: 3,
      text: "Meeting at 3 PM tomorrow",
      sender: "them",
      timestamp: "18:30",
      status: "delivered"
    }
  ],
  3: [
    {
      id: 1,
      text: "Yo! Are we still on for the gym today?",
      sender: "them",
      timestamp: "16:00",
      status: "read"
    },
    {
      id: 2,
      text: "Absolutely! I'll be there at 5:30",
      sender: "me",
      timestamp: "16:15",
      status: "read"
    },
    {
      id: 3,
      text: "Perfect! Don't forget your gym shoes this time 😄",
      sender: "them",
      timestamp: "16:20",
      status: "read"
    },
    {
      id: 4,
      text: "Haha, I won't! See you at the gym!",
      sender: "me",
      timestamp: "17:22",
      status: "delivered"
    }
  ],
  4: [
    {
      id: 1,
      text: "Hey! Can you help me with the presentation?",
      sender: "them",
      timestamp: "14:00",
      status: "read"
    },
    {
      id: 2,
      text: "Sure! What do you need help with?",
      sender: "me",
      timestamp: "14:10",
      status: "read"
    },
    {
      id: 3,
      text: "The slides on market analysis. I'm stuck on the charts.",
      sender: "them",
      timestamp: "14:15",
      status: "read"
    },
    {
      id: 4,
      text: "No problem! I'll send you some templates in 10 minutes.",
      sender: "me",
      timestamp: "14:20",
      status: "read"
    },
    {
      id: 5,
      text: "Thanks for your help 😊",
      sender: "them",
      timestamp: "16:15",
      status: "delivered"
    }
  ]
};
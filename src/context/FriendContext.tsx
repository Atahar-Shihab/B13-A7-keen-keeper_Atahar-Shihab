import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Friend,
  Interaction,
  VaultItem,
  ActionItem,
  CircleTier,
  ChannelType,
  InteractionDepth,
} from '../types';
import { SEED_FRIENDS, SEED_INTERACTIONS } from '../data/seedData';
import { computeFriendHealth } from '../lib/relationshipEngine';

const STORAGE_KEYS = {
  FRIENDS: 'keenkeeper_friends_v2',
  INTERACTIONS: 'keenkeeper_interactions_v2',
  THEME: 'keenkeeper_theme_v2',
};

interface FriendContextType {
  friends: Friend[];
  interactions: Interaction[];
  theme: 'light' | 'dark';
  isCommandPaletteOpen: boolean;
  preselectedFriendForCommand: string | null;
  isAddFriendModalOpen: boolean;
  isGuideModalOpen: boolean;

  // Friend CRUD
  addFriend: (friendData: {
    name: string;
    avatar?: string;
    email: string;
    phone?: string;
    location?: string;
    company?: string;
    role?: string;
    circleTier: CircleTier;
    tags?: string[];
    bio?: string;
    customCadenceDays?: number;
  }) => Friend;
  updateFriend: (id: string, updates: Partial<Friend>) => void;
  deleteFriend: (id: string) => void;
  getFriend: (id: string) => Friend | undefined;
  getFriendInteractions: (friendId: string) => Interaction[];

  // Interaction CRUD
  addInteraction: (data: {
    friendId: string;
    channel: ChannelType;
    depth: InteractionDepth;
    notes: string;
    date?: string;
    topics?: string[];
  }) => Interaction;
  updateInteraction: (id: string, updates: Partial<Interaction>) => void;
  deleteInteraction: (id: string) => void;

  // Vault Items CRUD
  addVaultItem: (
    friendId: string,
    item: Omit<VaultItem, 'id' | 'createdAt'>
  ) => void;
  updateVaultItem: (
    friendId: string,
    itemId: string,
    updates: Partial<VaultItem>
  ) => void;
  deleteVaultItem: (friendId: string, itemId: string) => void;

  // Action Items CRUD
  addActionItem: (
    friendId: string,
    item: Omit<ActionItem, 'id' | 'createdAt'>
  ) => void;
  toggleActionItem: (friendId: string, itemId: string) => void;
  deleteActionItem: (friendId: string, itemId: string) => void;

  // Bulk State / Portability / Sandbox
  resetToDemoData: () => void;
  importFullState: (friends: Friend[], interactions: Interaction[]) => void;

  // UI state
  toggleTheme: () => void;
  openCommandPalette: (friendId?: string) => void;
  closeCommandPalette: () => void;
  openAddFriendModal: () => void;
  closeAddFriendModal: () => void;
  openGuideModal: () => void;
  closeGuideModal: () => void;
}

const FriendContext = createContext<FriendContextType | undefined>(undefined);

// Helper to recalculate friends health using interaction ledger
const recalculateAllFriends = (
  rawFriends: Friend[],
  interactionList: Interaction[]
): Friend[] => {
  return rawFriends.map((friend) => {
    // Find all interactions for this friend, sort newest first
    const friendLogs = interactionList
      .filter((i) => i.friendId === friend.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const latest = friendLogs[0];
    const latestDate = latest ? latest.date : friend.lastContactDate || friend.createdAt;
    const computed = computeFriendHealth(
      { ...friend, lastContactDate: latestDate },
      latest
    );

    return {
      ...friend,
      lastContactDate: latestDate,
      healthScore: computed.score,
      status: computed.status,
    };
  });
};

export const FriendProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Modal states
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [preselectedFriendForCommand, setPreselectedFriendForCommand] = useState<string | null>(null);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(() => {
    try {
      return !localStorage.getItem('keenkeeper_guide_seen');
    } catch {
      return false;
    }
  });

  // Initialize CRM data from localStorage or seed data
  const [interactions, setInteractions] = useState<Interaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTERACTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved interactions, fallback to seed', e);
    }
    return SEED_INTERACTIONS;
  });

  const [friends, setFriends] = useState<Friend[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FRIENDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return recalculateAllFriends(parsed, SEED_INTERACTIONS);
        }
      }
    } catch (e) {
      console.error('Failed to parse saved friends, fallback to seed', e);
    }
    return recalculateAllFriends(SEED_FRIENDS, SEED_INTERACTIONS);
  });

  // Apply theme class to documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Sync friends to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(friends));
    } catch (e) {
      console.error('Error saving friends to localStorage', e);
    }
  }, [friends]);

  // Sync interactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(interactions));
    } catch (e) {
      console.error('Error saving interactions to localStorage', e);
    }
  }, [interactions]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const openCommandPalette = useCallback((friendId?: string) => {
    setPreselectedFriendForCommand(friendId || null);
    setIsCommandPaletteOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(false);
    setPreselectedFriendForCommand(null);
  }, []);

  const openAddFriendModal = useCallback(() => {
    setIsAddFriendModalOpen(true);
  }, []);

  const closeAddFriendModal = useCallback(() => {
    setIsAddFriendModalOpen(false);
  }, []);

  const openGuideModal = useCallback(() => {
    setIsGuideModalOpen(true);
  }, []);

  const closeGuideModal = useCallback(() => {
    setIsGuideModalOpen(false);
    try {
      localStorage.setItem('keenkeeper_guide_seen', 'true');
    } catch {}
  }, []);

  // Friend CRUD
  const addFriend = useCallback(
    (friendData: {
      name: string;
      avatar?: string;
      email: string;
      phone?: string;
      location?: string;
      company?: string;
      role?: string;
      circleTier: CircleTier;
      tags?: string[];
      bio?: string;
      customCadenceDays?: number;
    }): Friend => {
      const nowIso = new Date().toISOString();
      const newFriend: Friend = {
        id: `friend-${Date.now()}`,
        name: friendData.name,
        avatar:
          friendData.avatar ||
          `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80`,
        email: friendData.email,
        phone: friendData.phone || '',
        location: friendData.location || '',
        company: friendData.company || '',
        role: friendData.role || '',
        circleTier: friendData.circleTier,
        tags: friendData.tags || ['Network'],
        bio: friendData.bio || '',
        customCadenceDays: friendData.customCadenceDays,
        lastContactDate: nowIso,
        healthScore: 100,
        status: 'Thriving',
        vault: [],
        actionItems: [],
        createdAt: nowIso,
      };

      setFriends((prev) => [newFriend, ...prev]);
      return newFriend;
    },
    []
  );

  const updateFriend = useCallback(
    (id: string, updates: Partial<Friend>) => {
      setFriends((prev) => {
        const updated = prev.map((f) => (f.id === id ? { ...f, ...updates } : f));
        return recalculateAllFriends(updated, interactions);
      });
    },
    [interactions]
  );

  const deleteFriend = useCallback((id: string) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
    setInteractions((prev) => prev.filter((i) => i.friendId !== id));
  }, []);

  const getFriend = useCallback(
    (id: string): Friend | undefined => {
      return friends.find((f) => f.id === id);
    },
    [friends]
  );

  const getFriendInteractions = useCallback(
    (friendId: string): Interaction[] => {
      return interactions
        .filter((i) => i.friendId === friendId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    [interactions]
  );

  // Interaction CRUD
  const addInteraction = useCallback(
    (data: {
      friendId: string;
      channel: ChannelType;
      depth: InteractionDepth;
      notes: string;
      date?: string;
      topics?: string[];
    }): Interaction => {
      const nowIso = data.date || new Date().toISOString();
      const newInteraction: Interaction = {
        id: `int-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        friendId: data.friendId,
        date: nowIso,
        channel: data.channel,
        depth: data.depth,
        notes: data.notes,
        topics: data.topics || [],
        createdAt: new Date().toISOString(),
      };

      const updatedInteractions = [newInteraction, ...interactions];
      setInteractions(updatedInteractions);

      // Recalculate target friend's health score immediately
      setFriends((prev) => recalculateAllFriends(prev, updatedInteractions));

      return newInteraction;
    },
    [interactions]
  );

  const updateInteraction = useCallback(
    (id: string, updates: Partial<Interaction>) => {
      const updatedInteractions = interactions.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      );
      setInteractions(updatedInteractions);
      setFriends((prev) => recalculateAllFriends(prev, updatedInteractions));
    },
    [interactions]
  );

  const deleteInteraction = useCallback(
    (id: string) => {
      const updatedInteractions = interactions.filter((i) => i.id !== id);
      setInteractions(updatedInteractions);
      setFriends((prev) => recalculateAllFriends(prev, updatedInteractions));
    },
    [interactions]
  );

  // Vault Items CRUD
  const addVaultItem = useCallback(
    (friendId: string, item: Omit<VaultItem, 'id' | 'createdAt'>) => {
      const newItem: VaultItem = {
        ...item,
        id: `vault-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setFriends((prev) =>
        prev.map((f) => (f.id === friendId ? { ...f, vault: [newItem, ...f.vault] } : f))
      );
    },
    []
  );

  const updateVaultItem = useCallback(
    (friendId: string, itemId: string, updates: Partial<VaultItem>) => {
      setFriends((prev) =>
        prev.map((f) => {
          if (f.id !== friendId) return f;
          return {
            ...f,
            vault: f.vault.map((v) => (v.id === itemId ? { ...v, ...updates } : v)),
          };
        })
      );
    },
    []
  );

  const deleteVaultItem = useCallback((friendId: string, itemId: string) => {
    setFriends((prev) =>
      prev.map((f) => {
        if (f.id !== friendId) return f;
        return {
          ...f,
          vault: f.vault.filter((v) => v.id !== itemId),
        };
      })
    );
  }, []);

  // Action Items CRUD
  const addActionItem = useCallback(
    (friendId: string, item: Omit<ActionItem, 'id' | 'createdAt'>) => {
      const newItem: ActionItem = {
        ...item,
        id: `action-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setFriends((prev) =>
        prev.map((f) => (f.id === friendId ? { ...f, actionItems: [newItem, ...f.actionItems] } : f))
      );
    },
    []
  );

  const toggleActionItem = useCallback((friendId: string, itemId: string) => {
    setFriends((prev) =>
      prev.map((f) => {
        if (f.id !== friendId) return f;
        return {
          ...f,
          actionItems: f.actionItems.map((a) =>
            a.id === itemId ? { ...a, completed: !a.completed } : a
          ),
        };
      })
    );
  }, []);

  const deleteActionItem = useCallback((friendId: string, itemId: string) => {
    setFriends((prev) =>
      prev.map((f) => {
        if (f.id !== friendId) return f;
        return {
          ...f,
          actionItems: f.actionItems.filter((a) => a.id !== itemId),
        };
      })
    );
  }, []);

  // Reset to full fresh 12-contact, 63-interaction demo dataset
  const resetToDemoData = useCallback(() => {
    const refreshedFriends = recalculateAllFriends(SEED_FRIENDS, SEED_INTERACTIONS);
    setFriends(refreshedFriends);
    setInteractions(SEED_INTERACTIONS);
    try {
      localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(refreshedFriends));
      localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(SEED_INTERACTIONS));
    } catch (e) {
      console.error('Error writing reset state to localStorage', e);
    }
  }, []);

  // Bulk Import
  const importFullState = useCallback(
    (newFriends: Friend[], newInteractions: Interaction[]) => {
      const recalculated = recalculateAllFriends(newFriends, newInteractions);
      setFriends(recalculated);
      setInteractions(newInteractions);
      try {
        localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(recalculated));
        localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(newInteractions));
      } catch (e) {
        console.error('Error saving imported state', e);
      }
    },
    []
  );

  const value: FriendContextType = {
    friends,
    interactions,
    theme,
    isCommandPaletteOpen,
    preselectedFriendForCommand,
    isAddFriendModalOpen,
    addFriend,
    updateFriend,
    deleteFriend,
    getFriend,
    getFriendInteractions,
    addInteraction,
    updateInteraction,
    deleteInteraction,
    addVaultItem,
    updateVaultItem,
    deleteVaultItem,
    addActionItem,
    toggleActionItem,
    deleteActionItem,
    resetToDemoData,
    importFullState,
    toggleTheme,
    openCommandPalette,
    closeCommandPalette,
    openAddFriendModal,
    closeAddFriendModal,
    isGuideModalOpen,
    openGuideModal,
    closeGuideModal,
  };

  return <FriendContext.Provider value={value}>{children}</FriendContext.Provider>;
};

export const useFriends = (): FriendContextType => {
  const context = useContext(FriendContext);
  if (!context) {
    throw new Error('useFriends must be used within a FriendProvider');
  }
  return context;
};

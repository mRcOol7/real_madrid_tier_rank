export interface Player {
  id: string;
  name: string;
  image: string;
  era: 'current' | 'legend';
}

export type TierCategory = {
  id: string;
  name: string;
  color: string;
  description: string;
};

export interface DragItem {
  type: string;
  id: string;
  playerId: string;
}

export interface TierListState {
  [key: string]: string[];
}
import React, { useState, useCallback } from 'react';
import { CardType } from '@/types/card';

type CardContext = {
  card: CardType;
};

export const CardContext = React.createContext<CardContext>({
  card: CardType.info,
});

export const useCardContext = () => React.useContext(CardContext);

interface CardProvider {
  card: CardType;
  children: React.ReactNode;
}
export const CardProvider = ({ card, children }: CardProvider) => {
  return <CardContext.Provider value={{ card: card }}>{children}</CardContext.Provider>;
};

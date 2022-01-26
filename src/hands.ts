export enum Hand {
  HighCard = 1,
  Pair = 2,
  TwoPairs = 3,
  ThreeOfAKind = 4,
  Straight = 5,
  Flush = 6,
  FullHouse = 7,
  FourOfAKind = 8,
  StraightFlush = 9
}

export interface IHandProbability {
  hand: Hand,
  probabilityFive: number,
  probabilitySeven: number
}

export const handProbabilities: IHandProbability[]  = [
  {
    hand: Hand.HighCard,
    probabilityFive: 50.1,
    probabilitySeven: 17.4
  },
  {
    hand: Hand.Pair,
    probabilityFive: 42.3,
    probabilitySeven: 43.8
  },

  {
    hand: Hand.TwoPairs,
    probabilityFive: 4.75,
    probabilitySeven: 23.5
  },
  {
    hand: Hand.ThreeOfAKind,
    probabilityFive: 2.11,
    probabilitySeven: 4.83
  },
  {
    hand: Hand.Straight,
    probabilityFive: 0.392,
    probabilitySeven: 4.62
  },
  {
    hand: Hand.Flush,
    probabilityFive: 0.197,
    probabilitySeven: 3.03
  },
  {
    hand: Hand.FullHouse,
    probabilityFive: 0.144,
    probabilitySeven: 2.60
  },
  {
    hand: Hand.FourOfAKind,
    probabilityFive: 0.0240,
    probabilitySeven: 0.168
  },
  {
    hand: Hand.StraightFlush,
    probabilityFive: 0.00154,
    probabilitySeven: 0.0311
  }
]
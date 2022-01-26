import { cardValue } from "./gamestate";
import { PokerHand, PokerCard, Hand } from "./hands";

export function detectStraights(allCards: PokerCard[]): PokerHand[] {
    const byRankValue: PokerCard[][] = [];
    allCards.forEach(c => {
        const value = cardValue(c);
        let rankList = byRankValue[value];
        if(rankList === undefined) {
            byRankValue[value] = [];
            rankList = byRankValue[value];
        }

        rankList.push(c);
    });

    const straightHands: PokerHand[] = [];
    // idea: recursive to enumerate all possible hand combinations?
    function checkStraight(rankValue: number, numRemaining: number, numHoleCardsSoFar: number) {
        if(numRemaining <= 0) {
            // base case
            straightHands.push({hand: Hand.Straight, numHoleCards: numHoleCardsSoFar });
            return;
        }

        const possibleCards = byRankValue[rankValue];
        if(possibleCards == null || possibleCards.length === 0) {
            return;
        }
        const hasHoleCard = possibleCards.reduce((hasHole,c) => hasHole || c.isHole, false);
        const hasCommunityCard = possibleCards.reduce((hasCommunity,c) => hasCommunity || !c.isHole, false);

        if(hasHoleCard) {
            // recurse by taking one of the hole cards
            checkStraight(rankValue + 1, numRemaining - 1, numHoleCardsSoFar + 1);
        }
        
        if(hasCommunityCard) {
            // recurse without taking one of the hole cards
            checkStraight(rankValue + 1, numRemaining - 1, numHoleCardsSoFar);
        }

        // we might not recurse => not a straight
    }

    for(let r = 2; r <= 10; r += 1) {
        checkStraight(r, 5, 0);
    }
    return straightHands;
}


import { C1e9, C1e12, VERSION_V2, VERSION_V3 } from "../constants";

function addMargin(odds: bigint, margin: bigint, decimals: bigint): bigint {
  const revertedOdds = decimals ** 2n / (decimals - decimals ** 2n / odds);
  const marginEUR = decimals + margin;
  const a = (marginEUR * (revertedOdds - decimals)) / (odds - decimals);

  const b =
    (((revertedOdds - decimals) * decimals) / (odds - decimals)) * margin +
    (decimals * margin) / decimals;
  const c = decimals * 2n - marginEUR;

  const newOdds =
    b ** 2n +
    (4n * a * c) ** BigInt(0.5) -
    (b * decimals) / (2n * a) +
    decimals;

  return newOdds;
}

export function toDecimal(x: bigint, decimals: number = 18): number {
  const divisor = 10n ** BigInt(decimals);

  return Number(x) / Number(divisor);
}

function ceil(a: bigint, m: bigint, decimals: bigint): bigint {
  if (a < decimals) {
    return decimals;
  }

  return ((a + m - 1n) / m) * m;
}

function v1(
  fund1: BigInt,
  fund2: BigInt,
  outcomeIndex: i32,
  margin: BigInt,
  decimals: BigInt
): BigInt {
  const amount = BigInt.fromString("0");

  if (outcomeIndex === 0) {
    const pe1 = fund1
      .plus(amount)
      .times(decimals)
      .div(fund1.plus(fund2).plus(amount));
    const ps1 = fund1.times(decimals).div(fund1.plus(fund2));
    const cAmount = ceil(
      amount.times(decimals).div(fund1.div(BigInt.fromString("100"))),
      decimals,
      decimals
    ).div(decimals);

    if (cAmount.equals(BigInt.fromString("1"))) {
      return addMargin(decimals.pow(2).div(ps1), margin, decimals);
    }

    const odds = decimals.pow(3).div(
      pe1
        .times(cAmount)
        .plus(ps1.times(BigInt.fromString("2")))
        .minus(pe1.times(BigInt.fromString("2")))
        .times(decimals)
        .div(cAmount)
    );

    return addMargin(odds, margin, decimals);
  }

  if (outcomeIndex === 1) {
    const pe2 = fund2
      .plus(amount)
      .times(decimals)
      .div(fund1.plus(fund2).plus(amount));
    const ps2 = fund2.times(decimals).div(fund1.plus(fund2));
    const cAmount = ceil(
      amount.times(decimals).div(fund2.div(BigInt.fromString("100"))),
      decimals,
      decimals
    ).div(decimals);

    if (cAmount.equals(BigInt.fromString("1"))) {
      return addMargin(decimals.pow(2).div(ps2), margin, decimals);
    }

    const odds = decimals.pow(3).div(
      pe2
        .times(cAmount)
        .plus(ps2.times(BigInt.fromString("2")))
        .minus(pe2.times(BigInt.fromString("2")))
        .times(decimals)
        .div(cAmount)
    );

    return addMargin(odds, margin, decimals);
  }

  return BigInt.zero();
}

function v2(
  fund1: BigInt,
  fund2: BigInt,
  outcomeIndex: i32,
  margin: BigInt,
  decimals: BigInt
): BigInt {
  const amount = BigInt.fromString("0");

  const activeFund = outcomeIndex === 0 ? fund1 : fund2;

  const odds = fund1
    .plus(fund2)
    .plus(amount)
    .times(C1e12)
    .div(activeFund.plus(amount));

  if (odds.equals(C1e12)) {
    return BigInt.zero();
  }

  return addMargin(odds, margin, decimals);
}

// v3
const MAX_ITERATIONS = 32;
const MAX_ODDS = 100n * C1e12;
const PRECISION = 1000000n;

function sum(items: bigint[]): bigint {
  let acc = 0n;

  for (let i = 0; i < items.length; i++) {
    acc = acc + items[i];
  }

  return acc;
}

function mul(self: bigint, other: bigint): bigint {
  // return self.times(other).div(C1e12);
  return (self * other) / C1e12;
}

function div(self: bigint, other: bigint): bigint {
  // return self.times(C1e12).div(other);
  return (self * C1e12) / other;
}

function ratio(self: bigint, other: bigint): bigint {
  //return self.gt(other) ? div(self, other) : div(other, self);
  return self > other ? div(self, other) : div(other, self);
}

function calcProbability(
  outcomeFund: bigint,
  fund: bigint,
  winningOutcomesCount: number
): bigint | null {
  const probability = div(
    // outcomeFund.times(BigInt.fromI32(winningOutcomesCount)),
    // fund
    outcomeFund * BigInt(winningOutcomesCount),
    fund
  );

  // if (probability.lt(BigInt.fromString("1000")) || probability.ge(C1e12)) {
  //   log.error(
  //     "v3 odds probability lower than 100 or greater than 1^12, outcomeFund is {}",
  //     [outcomeFund.toString()]
  //   );

  //   return null;
  // }

  if (probability < 1000n || probability >= C1e12) {
    // console.log(
    //   "v3 odds probability lower than 100 or greater than 1^12, outcomeFund is {}",
    //   [outcomeFund.toString()]
    // );
    return null;
  }

  return probability;
}

// /**
//  * @notice Implementation of the sigmoid function.
//  * @notice The sigmoid function is commonly used in machine learning to limit output values within a range of 0 to 1.
//  */
function sigmoid(self: bigint): bigint {
  // return div(self, self.plus(C1e12));
  return div(self, self + C1e12);
}

function getOddsFromProbabilities(
  probabilities: BigInt[],
  margin: BigInt,
  winningOutcomesCount: u8
): BigInt[] | null {
  const length = probabilities.length;

  const odds: BigInt[] = [];
  const spreads: BigInt[] = [];

  if (margin.le(BigInt.fromString("0"))) {
    for (let i = 0; i < length; i++) {
      odds[i] = C1e12.times(C1e12).div(probabilities[i]);
    }

    return odds;
  }

  for (let i = 0; i < length; i++) {
    spreads[i] = mul(C1e12.minus(probabilities[i]), margin);
  }

  let error = margin;
  const spreadMultiplier = BigInt.fromI32(winningOutcomesCount).times(C1e12);

  for (let k = 0; k < MAX_ITERATIONS; ++k) {
    let oddsSpread = BigInt.fromString("0");
    {
      let spread = BigInt.fromString("0");

      for (let i = 0; i < length; i++) {
        const price = div(C1e12.minus(spreads[i]), probabilities[i]);
        odds[i] = price;
        spread = spread.plus(div(C1e12, price));
      }

      oddsSpread = C1e12.minus(div(spreadMultiplier, spread));
    }

    if (ratio(margin, oddsSpread).minus(C1e12).lt(PRECISION)) {
      return odds;
    }

    if (margin.le(oddsSpread)) {
      log.error("margin <= oddsSpread", []);

      return null;
    }

    const newError = margin.minus(oddsSpread);

    if (newError === error) {
      if (div(margin, oddsSpread).minus(C1e12).ge(PRECISION)) {
        log.error("margin / oddsSpread - 1 >= precision", []);

        return null;
      }

      return odds;
    }

    error = newError;

    for (let i = 0; i < length; i++) {
      const sig = sigmoid(
        div(
          div(
            div(mul(error, spreads[i]), C1e12.minus(div(C1e12, odds[i]))),
            C1e12.minus(margin)
          ),
          oddsSpread
        )
      );

      spreads[i] = spreads[i].plus(
        mul(C1e12.minus(spreads[i]).minus(probabilities[i]), sig)
      );
    }
  }

  return odds;
}

export function v3(
  funds: BigInt[],
  margin: BigInt,
  winningOutcomesCount: u8
): BigInt[] | null {
  const probabilities: BigInt[] = [];
  const totalFund = sum(funds);

  if (totalFund.equals(BigInt.fromString("0"))) {
    log.error("v3 totalFund is 0", []);

    return null;
  }

  for (let i = 0; i < funds.length; i++) {
    const probability = calcProbability(
      funds[i],
      totalFund,
      winningOutcomesCount
    );

    if (probability === null) {
      log.error("v3 odds probability is null, fund[{}] is {}", [
        i.toString(),
        funds[i].toString()
      ]);

      return null;
    }

    probabilities[i] = probability;
  }

  const odds = getOddsFromProbabilities(
    probabilities,
    margin,
    winningOutcomesCount
  );

  if (odds === null) {
    return null;
  }

  for (let i = 0; i < funds.length; i++) {
    if (odds[i].gt(MAX_ODDS)) {
      odds[i] = MAX_ODDS;
    }

    if (odds[i].le(C1e12)) {
      log.error("v3 odds[{}] {} lower than 1^12, fund[{}] is {}", [
        i.toString(),
        odds[i].toString(),
        i.toString(),
        funds[i].toString()
      ]);

      return null;
    }
  }

  return odds;
}

export function getOdds(
  version: string,
  funds: bigint[],
  margin: bigint,
  winningOutcomesCount: number
): bigint[] | null {
  if (version === VERSION_V3) {
    return v3(funds, margin, winningOutcomesCount);
  }

  if (version === VERSION_V2) {
    return [
      v2(funds[0], funds[1], 0, margin, C1e12),
      v2(funds[0], funds[1], 1, margin, C1e12)
    ];
  }

  return [
    v1(funds[0], funds[1], 0, margin, C1e9),
    v1(funds[0], funds[1], 1, margin, C1e9)
  ];
}

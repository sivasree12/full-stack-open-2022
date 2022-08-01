const rls = require("readline-sync");

interface rawValues {
  rawTarget: string;
  rawDailyHours: string[];
}

interface parsedValues {
  parsedTarget: number;
  parsedDailyHours: number[];
}

interface Result {
  periodLenght: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const getInput = (): rawValues => {
  const rawTarget = rls.question("What is your target value? ");

  // Create an array with values from 0 to 99
  const numbers = Array.from(Array(100).keys());
  const rawDailyHours: string[] = [];

  for (const number of numbers) {
    const input = rls.question(
      `How many hours did you exercise on day ${
        number + 1
      }? (Press 'enter' to quit): `
    );

    if (input) {
      rawDailyHours.push(input);
    } else {
      break;
    }
  }

  return { rawTarget, rawDailyHours };
};

const parseInput = (
  rawTarget: string,
  rawDailyHours: string[]
): parsedValues => {
  if (Number(rawTarget) <= 0) {
    throw new Error("Target must be a positive value!");
  }
  if (rawDailyHours.length === 0) {
    throw new Error("Provide at least one value for exercised days!");
  }
  if (
    !isNaN(Number(rawTarget)) &&
    !rawDailyHours.map((hour) => Number(hour)).some(isNaN)
  ) {
    return {
      parsedTarget: Number(rawTarget),
      parsedDailyHours: rawDailyHours.map((hour) => Number(hour)),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const calculateExercises = (
  target: number,
  dailyHours: number[]
): Result => {
  const periodLenght = dailyHours.length;
  const trainingDays = dailyHours.filter((hour) => hour > 0).length;
  const average = dailyHours.reduce((a, b) => a + b, 0) / periodLenght;
  const success = average >= target;

  const getRating = (average: number, target: number): number => {
    if (average < target * 0.9) return 1;
    if (average < target) return 2;
    if (average >= target) return 3;
  };

  const getRatingDescription = (rating: number): string => {
    if (rating === 1) {
      return "Don't give up! You can do better next week!";
    }
    if (rating === 2) {
      return "Good job but try doing better next week!";
    }
    if (rating === 3) {
      return "Nice work! Keep it up!";
    }
  };

  const rating = getRating(average, target);
  const ratingDescription = getRatingDescription(rating);

  return {
    periodLenght,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  const { rawTarget, rawDailyHours } = getInput();
  const { parsedTarget, parsedDailyHours } = parseInput(
    rawTarget,
    rawDailyHours
  );
  console.log(calculateExercises(parsedTarget, parsedDailyHours));
} catch (error) {
  if (error instanceof Error)
    console.log("Error, something bad happened, message: ", error.message);
}

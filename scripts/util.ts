export const extractCodeFromOutput = (output: string) => {
  const regex = /```HTML\n([\s\S]*?)```/;
  const match = output.match(regex);

  if (match) {
    return match[1];
  }

  return null;
};

export const possibleMethods = [
  'adding a unique feature',
  'adding a non-trivial feature',
  'adding a creative feature',
  'refactoring the code and expand the functionality',
  'adding recursion to the code',
  'reimagining the code',
];
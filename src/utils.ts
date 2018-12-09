export function removeNulls(input: any[]): any[] {
  return input.reduce((acc: any[], curr: any) => {
    if (curr !== null) {
      acc.push(curr);
    }

    return acc;
  }, []);
}

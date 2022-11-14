export type Issue = {
  name: 'SyntaxError' | 'ReferenceError' | 'TypeError';
  message: string;
  status: 'open' | 'resolved';
  numEvents: number;
  numUsers: number;
  value: number;
};

type TablePropsType = {
  issues: Issue[];
};

export default TablePropsType;

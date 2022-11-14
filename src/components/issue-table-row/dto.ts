import React from 'react';
import { Issue } from '../table/dto';

type IssueTableRowProps = (Issue & { id: string }) & {
  isSelected: boolean;
  handleIssueClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default IssueTableRowProps;

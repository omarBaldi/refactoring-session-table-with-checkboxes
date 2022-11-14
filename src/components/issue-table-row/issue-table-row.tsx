import React, { FC } from 'react';
import IssueTableRowProps from './dto';
import styles from '../table/styles.module.css';

/**
 * TODO: crete css module file
 */
const IssueTableRow: FC<IssueTableRowProps> = ({
  id,
  status,
  isSelected,
  name,
  message,
  handleIssueClick,
}: IssueTableRowProps) => {
  const isIssueOpen: boolean = status === 'open';

  return (
    <tr
      className={isIssueOpen ? styles.openIssue : styles.resolvedIssue}
      style={{
        backgroundColor: isSelected ? '#ffffff' : '#eeeeee',
      }}
    >
      <td>
        <input
          type='checkbox'
          className={styles.checkbox}
          checked={isSelected}
          data-id={id}
          disabled={!isIssueOpen}
          onChange={handleIssueClick}
        />
      </td>
      <td>{name}</td>
      <td>{message}</td>
      <td>
        <span className={isIssueOpen ? styles.greenCircle : styles.redCircle} />
      </td>
    </tr>
  );
};

export default IssueTableRow;

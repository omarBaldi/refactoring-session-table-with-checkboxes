import React, { useState, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IssueTableRow } from '../issue-table-row';
import TablePropsType, { Issue } from './dto';
import styles from './styles.module.css';

/**
 *
 * @param {Array} issues
 */
function Table({ issues }: TablePropsType) {
  const [selectedIssues, setSelectedIssues] = useState<Map<string, boolean>>(
    new Map()
  );

  const selectedIssuesAmount: number = selectedIssues.size;

  const { issuesWithId, issuesOpenedAmount } = useMemo<{
    issuesWithId: (Issue & { id: string })[];
    issuesOpenedAmount: number;
  }>(() => {
    const issuesWithId = issues.map((issue) => ({ ...issue, id: uuidv4() }));

    return {
      issuesWithId,
      issuesOpenedAmount: issuesWithId.filter(({ status }) => status === 'open')
        .length,
    };
  }, [issues]);

  const handleIssueClick = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
      const { checked: isCurrentIssueChecked, dataset } = target;
      const currentIssueId: string | undefined = dataset['id'];

      if (typeof currentIssueId === 'undefined') return;

      setSelectedIssues((prevSelectedIssues) => {
        const updatedIssues = new Map(prevSelectedIssues);

        isCurrentIssueChecked
          ? updatedIssues.set(currentIssueId, isCurrentIssueChecked)
          : updatedIssues.delete(currentIssueId);

        return updatedIssues;
      });
    },
    []
  );

  const toggleAllIssues = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    const shouldAllIssuesBeSelected: boolean = target.checked;

    setSelectedIssues((prevSelectedIssues) => {
      if (!shouldAllIssuesBeSelected) return new Map();

      const updated = new Map(prevSelectedIssues);

      for (const { id, status } of issuesWithId) {
        const isIssueAlreadySelected: boolean = updated.get(id) ?? false;

        if (!isIssueAlreadySelected && status === 'open') {
          updated.set(id, true);
        }
      }

      return updated;
    });
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            <input
              className={styles.checkbox}
              type='checkbox'
              checked={issuesOpenedAmount === selectedIssuesAmount}
              onChange={toggleAllIssues}
            />
          </th>
          <th className={styles.numChecked}>
            {selectedIssuesAmount > 0
              ? `Selected ${selectedIssuesAmount}`
              : 'None selected'}
          </th>
        </tr>
        <tr>
          <th />
          <th>Name</th>
          <th>Message</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {issuesWithId.map((issue, _index: number) => {
          const isIssueSelected: boolean =
            selectedIssues.get(issue.id) ?? false;

          return (
            <IssueTableRow
              key={issue.id}
              {...issue}
              isSelected={isIssueSelected}
              handleIssueClick={handleIssueClick}
            />
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;

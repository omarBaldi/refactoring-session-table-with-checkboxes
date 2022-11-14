import React, { useState, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IssueTableRow } from '../issue-table-row';
import TablePropsType, { Issue } from './dto';
import styles from './styles.module.css';

/**
 *
 * TODO: define function to change the checked value of the issue clicked
 * TODO: being able to know the amount of issues already selected (active)
 * TODO: define function to toggle either toggle on/off all of the issues
 *
 * @param {Array} issues
 */
function Table({ issues }: TablePropsType) {
  const [checkedState, setCheckedState] = useState(
    new Array(issues.length).fill({
      checked: false,
      backgroundColor: '#ffffff',
    })
  );

  const [selectDeselectAllIsChecked, setSelectDeselectAllIsChecked] =
    useState(false);

  const [numCheckboxesSelected, setNumCheckboxesSelected] = useState(0);

  /* const handleOnChange = (position: number) => {
    const updatedCheckedState = checkedState.map((element, index) => {
      if (position === index) {
        return {
          ...element,
          checked: !element.checked,
          backgroundColor: element.checked ? '#ffffff' : '#eeeeee',
        };
      }
      return element;
    });
    setCheckedState(updatedCheckedState);

    const totalSelected = updatedCheckedState
      .map((element) => element.checked)
      .reduce((sum, currentState, index) => {
        if (currentState) {
          return sum + issues[index].value;
        }
        return sum;
      }, 0);
    setNumCheckboxesSelected(totalSelected);

    handleIndeterminateCheckbox(totalSelected);
  }; */

  /* const handleIndeterminateCheckbox = (total: number) => {
    const indeterminateCheckbox = document.getElementById(
      'custom-checkbox-selectDeselectAll'
    );
    let count = 0;

    issues.forEach((element) => {
      if (element.status === 'open') {
        count += 1;
      }
    });

    if (total === 0) {
      //indeterminateCheckbox.indeterminate = false;
      setSelectDeselectAllIsChecked(false);
    }
    if (total > 0 && total < count) {
      //indeterminateCheckbox.indeterminate = true;
      setSelectDeselectAllIsChecked(false);
    }
    if (total === count) {
      //indeterminateCheckbox.indeterminate = false;
      setSelectDeselectAllIsChecked(true);
    }
  };
 */

  /* const handleSelectDeselectAll = (event: any) => {
    let { checked } = event.target;

    const allTrueArray: any[] = [];
    issues.forEach((element) => {
      if (element.status === 'open') {
        allTrueArray.push({ checked: true, backgroundColor: '#eeeeee' });
      } else {
        allTrueArray.push({ checked: false, backgroundColor: '#ffffff' });
      }
    });

    const allFalseArray = new Array(issues.length).fill({
      checked: false,
      backgroundColor: '#ffffff',
    });
    checked ? setCheckedState(allTrueArray) : setCheckedState(allFalseArray);

    const totalSelected = (checked ? allTrueArray : allFalseArray)
      .map((element) => element.checked)
      .reduce((sum, currentState, index) => {
        if (currentState && issues[index].status === 'open') {
          return sum + issues[index].value;
        }
        return sum;
      }, 0);
    setNumCheckboxesSelected(totalSelected);
    setSelectDeselectAllIsChecked((prevState) => !prevState);
  }; */

  /*
   *-----------------------------------------------------*
   *                   NEW REFACTORED CODE
   *-----------------------------------------------------*
   */

  /**
   * @desc contains the id and the checked value (true) of the issue selected
   */
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

        if (isCurrentIssueChecked) {
          updatedIssues.set(currentIssueId, isCurrentIssueChecked);
        } else {
          updatedIssues.delete(currentIssueId);
        }

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

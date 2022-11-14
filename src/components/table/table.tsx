import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
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

  const issuesWithId = useMemo<(Issue & { id: string })[]>(() => {
    return issues.map((issue) => ({ ...issue, id: uuidv4() }));
  }, [issues]);

  const handleIssueClick = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked: isCurrentIssueChecked, dataset } = target;
    const currentIssueId: string | undefined = dataset['id'];

    if (typeof currentIssueId === 'undefined') return;

    setSelectedIssues((prevSelectedIssues) => {
      const updatedIssues: typeof selectedIssues = new Map(prevSelectedIssues);

      if (isCurrentIssueChecked) {
        updatedIssues.set(currentIssueId, isCurrentIssueChecked);
      } else {
        updatedIssues.delete(currentIssueId);
      }

      return updatedIssues;
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
              //* the checked value will either be true
              //* if all of the issues are set to true
              //! temporarily set to false
              checked={false}
              //TODO: describe function
              //onChange={handleSelectDeselectAll}
            />
          </th>
          <th className={styles.numChecked}>
            {numCheckboxesSelected
              ? `Selected ${numCheckboxesSelected}`
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
        {issuesWithId.map(({ id, name, message, status }, _index: number) => {
          const isIssueOpen: boolean = status === 'open';
          const isIssueSelected: boolean = selectedIssues.get(id) ?? false;

          return (
            <tr
              key={id}
              className={isIssueOpen ? styles.openIssue : styles.resolvedIssue}
              //TODO: apply style depending wheter or not the current issue is checked
              //style={checkedState[index]}
            >
              <td>
                {isIssueOpen ? (
                  <input
                    type='checkbox'
                    className={styles.checkbox}
                    checked={isIssueSelected}
                    data-id={id}
                    onChange={handleIssueClick}
                  />
                ) : (
                  <input className={styles.checkbox} type='checkbox' disabled />
                )}
              </td>
              <td>{name}</td>
              <td>{message}</td>
              <td>
                <span
                  className={
                    isIssueOpen ? styles.greenCircle : styles.redCircle
                  }
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;

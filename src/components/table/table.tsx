import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TablePropsType, { Issue } from './dto';
import styles from './styles.module.css';

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

  const handleOnChange = (position: number) => {
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
  };

  const handleIndeterminateCheckbox = (total: number) => {
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

  const handleSelectDeselectAll = (event: any) => {
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
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            <input
              className={styles.checkbox}
              type={'checkbox'}
              id={'custom-checkbox-selectDeselectAll'}
              name={'custom-checkbox-selectDeselectAll'}
              value={'custom-checkbox-selectDeselectAll'}
              checked={selectDeselectAllIsChecked}
              onChange={handleSelectDeselectAll}
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
        {issues.map(({ name, message, status }, index) => {
          let issueIsOpen = status === 'open';
          let onClick: any = issueIsOpen ? () => handleOnChange(index) : null;
          let stylesTr = issueIsOpen ? styles.openIssue : styles.resolvedIssue;

          return (
            <tr
              className={stylesTr}
              style={checkedState[index]}
              key={index}
              onClick={onClick}
            >
              <td>
                {issueIsOpen ? (
                  <input
                    className={styles.checkbox}
                    type={'checkbox'}
                    id={`custom-checkbox-${index}`}
                    name={name}
                    value={name}
                    checked={checkedState[index].checked}
                    onChange={() => handleOnChange(index)}
                  />
                ) : (
                  <input
                    className={styles.checkbox}
                    type={'checkbox'}
                    disabled
                  />
                )}
              </td>
              <td>{name}</td>
              <td>{message}</td>
              <td>
                {issueIsOpen ? (
                  <span className={styles.greenCircle} />
                ) : (
                  <span className={styles.redCircle} />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;

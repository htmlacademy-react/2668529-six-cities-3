import {useState} from 'react';
import {SORT_OPTIONS, SortType} from '../../const';

type SortingProps = {
  currentSort: SortType;
  onSortChange: (sortType: SortType) => void;
};

function Sorting({ currentSort, onSortChange }: SortingProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentSort}
        <svg className="places__sorting-arrow" width={7} height={4}>
          <use xlinkHref="#icon-arrow-select" />
        </svg>
      </span>

      <ul className={`places__options places__options--custom ${isOpen ? 'places__options--opened' : ''}`}>
        {SORT_OPTIONS.map((option) => (
          <li
            className={`places__option ${option === currentSort ? 'places__option--active' : ''}`}
            tabIndex={0}
            key={option}
            onClick={() => {
              onSortChange(option);
              setIsOpen(false);
            }}
          >
            {option}
          </li>
        ))}
      </ul>
    </form>
  );
}

export default Sorting;

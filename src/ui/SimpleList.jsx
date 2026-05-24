import { Fragment } from "react";

function SimpleList({ items, renderItem, getKey, className = "" }) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <Fragment key={getKey ? getKey(item, index) : index}>
          {renderItem(item, index)}
        </Fragment>
      ))}
    </div>
  );
}

export default SimpleList;

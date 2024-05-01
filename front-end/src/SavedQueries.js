import { useState } from 'react';

export function SavedQueries(params) {
    const [showResetAlert, setShowResetAlert] = useState(false);

    function onSavedQueryClick(savedQuery) {
        params.onQuerySelect(savedQuery);
    }

    function resetSavedQueries() {
        if (showResetAlert) {
            // Clear saved queries and update the displayed list
            const emptyQueryList = [];
            params.setSavedQueries(emptyQueryList);
            setShowResetAlert(false);
        } else {
            // Show confirmation alert
            setShowResetAlert(true);
        }
    }

    function getQueries() {
        return params.savedQueries.map((item, idx) => {
            let trimTitle = item.queryName.substring(0, 30);
            return (
                <li
                    key={idx}
                    onClick={() => onSavedQueryClick(item)}
                    className={item.queryName === params.selectedQueryName ? "selected" : ""}
                >
                    {trimTitle + ': "' + item.q + '"'}
                </li>
            );
        });
    }

    return (
        <div className="saved-queries-container">
            {params.currentUser && ( // Display reset button only when a user is logged in
                <button onClick={resetSavedQueries}>Reset</button>
            )}
            {showResetAlert && (
                <div className="reset-alert">
                    <p>Are you sure you want to erase the list?</p>
                    <button onClick={() => setShowResetAlert(false)}>Cancel</button>
                    <button onClick={resetSavedQueries}>Reset</button>
                </div>
            )}
            <ul className="saved-queries-list">
                {params.savedQueries && params.savedQueries.length > 0 ? (
                    getQueries()
                ) : (
                    <li>No Saved Queries, Yet!</li>
                )}
            </ul>
        </div>
    );
}
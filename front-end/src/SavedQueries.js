import { useState } from 'react';

export function SavedQueries(params) {

    const [selectedQuery, setSelectedQuery] = useState(null);
    const [showResetAlert, setShowResetAlert] = useState(false);

    function currentUserIsAdmin() {
        if (params.currentUser) {
            const storedToken = localStorage.getItem(params.currentUser.username);
            if (storedToken) {
                return true;
            }
        }
        return false;
    }

    function onSavedQueryClick(savedQuery) {
        setSelectedQuery(savedQuery);
        params.onQuerySelect(savedQuery);
    }

    function resetSavedQueries() {
        if (showResetAlert) {
            // Clear saved queries and update the displayed list
            const emptyQueryList = [];
            params.setSavedQueries(emptyQueryList);
            params.saveQueryList(emptyQueryList);
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
            {params.currentUser && params.savedQueries && params.savedQueries.length > 0 && ( // Display reset button only when a user is logged in
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
            <div className="query-details">
                {selectedQuery && params.savedQueries && params.savedQueries.length > 0 && (
                    <div>
                        <p className="query-name">Name: {selectedQuery.queryName}</p>
                        <p className="query-property">Search Term: {selectedQuery.q}</p>
                        {currentUserIsAdmin() && (
                            <>
                                <p className="query-property">Language: {selectedQuery.language}</p>
                                <p className="query-property">Page Size: {selectedQuery.pageSize}</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
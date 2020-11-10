import React from 'react';

const SearchFilters = ({searchCategories, setSearchCategories}) => {
    return ( 
        <div id="filters">
            {Object.keys(searchCategories).map(cat => (
                <span>
                    <input type="checkbox" id={cat} name={cat} checked={searchCategories[cat]} onChange={(e) => {
                        let newSearchCategories = {...searchCategories};
                        newSearchCategories[cat] = !searchCategories[cat];
                        setSearchCategories(newSearchCategories);
                    }} />
                    <label for={cat}>{cat}</label>
                </span>
            ))}
        </div>
    );
}
 
export default SearchFilters;
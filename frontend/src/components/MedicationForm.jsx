import { useState } from "react";
import { Link } from 'react-router-dom'

export const MedForm = () => {
    const [change, setChanges] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        setChanges(value)
    };

    const returnToDashBoard = () => {
        window.location.href = '/dashboard'
    }

    return (
        <div className="med-container">
            <h1>Medical Form</h1>
            <form>
                <label htmlFor="medicine">Name of Medicine</label>
                <input type="text" onChange={handleChange} autoComplete="on" placeholder="Enter Name Of Medicine"/>


                <label htmlFor="dosage">Dosage of Medicine</label>
                <input type="text" autoComplete="on" required/>
                <select id="measurements" required>
                <option value="milligrams">milligrams</option>
                <option value="liters">liters</option>
                <option value="pints">pints</option>
                <option value="quarts">quarts</option>
                </select>


                <label htmlFor="frequency">Frequency</label>
                <select id="freq" required>
                    <option value="Once a day">Once a day</option>
                    <option value="Twice a day">Twice a day</option>
                    <option value="Every 8 hours">Every 8 hours</option>
                </select>

                <input type="submit" value="Submit" onClick={returnToDashBoard}/>
            </form>
        </div>
    )
};
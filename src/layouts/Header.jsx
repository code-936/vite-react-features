import { useNavigate } from "react-router-dom";

export function Header() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/home");
    }
    return (
        <div>
            This is Header.
            <button type="button" onClick={handleClick}>Home</button>
        </div>
    )
};
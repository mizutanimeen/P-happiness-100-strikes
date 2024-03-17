import { Link } from 'react-router-dom';
import './css/header.css';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TimeRecordDeleteRequest } from '../axios/time';

// TODO: ヘッダーのデザインを整える
export function BackHomeHeader(): JSX.Element {
    return <>
        <div className="headerContainer">
            <Link to="/">Home</Link>
        </div>
    </>
}

export function RecordHeader(props: { id: string | undefined }): JSX.Element {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const navigate = useNavigate();

    const deleteRecord = () => {
        const id = props.id;
        if (id === undefined) {
            return;
        }
        setAnchorEl(null);
        axios(TimeRecordDeleteRequest(id)).then((result) => {
            if (result.status === 200) {
                navigate("/");
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <>
            <div className="headerContainer">
                <Link to="/">Home</Link>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={(e) => setAnchorEl(null)}
                >
                    <MenuItem onClick={deleteRecord}>削除</MenuItem>
                </Menu >
            </div >
        </ >
    );
}

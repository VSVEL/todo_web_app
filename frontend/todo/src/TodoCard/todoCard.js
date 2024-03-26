import React, { useState } from 'react';
import * as MUI from '@mui/material';
import * as MUIIcon from '@mui/icons-material';

const TodoCard = (props) => {
    const [isChecked, setChecked] = useState(props.todo.completed);

    const handleToggle = () => {
        if (!isChecked) {
            setChecked(true);
            props.onToggle(props.todo.id); // Pass the todo ID to the parent component
        }
    };

    const handleEdit = () => {
        props.onEdit(props.todo.id); // Pass the todo ID to the parent component for editing
    };

    const handleDelete = () => {
        props.onDelete(props.todo.id); // Pass the todo ID to the parent component for editing
    };

    return (
        <MUI.Box sx={{ margin: 'auto', maxWidth: 400 }}>
            <MUI.Card style={{ marginBottom: '10px' }}>
                <MUI.CardContent style={{ display: 'flex', flexDirection: 'row' }}>
                    <MUI.Checkbox
                        checked={isChecked}
                        onChange={handleToggle}
                    />
                    <MUI.CardContent style={{ display: 'flex', flexDirection: 'column' }}>
                        <MUI.Typography
                            variant="body1"
                            style={{ textDecoration: isChecked ? 'line-through' : 'none' }}
                        >
                            {props.todo.title}
                        </MUI.Typography>
                        <MUI.Typography variant="body2" style={{ textDecoration: isChecked ? 'line-through' : 'none' }}>
                            {props.todo.description}
                        </MUI.Typography>
                    </MUI.CardContent>
                    {!isChecked && ( // Render the Edit button only if the task is not checked
                        <>
                            <MUI.IconButton onClick={handleEdit} size="small">
                                <MUIIcon.Edit />
                            </MUI.IconButton>
                            
                        </>
                    )}
                    <MUI.IconButton onClick={handleDelete} size="small">
                                <MUIIcon.Delete />
                            </MUI.IconButton>
                </MUI.CardContent>
            </MUI.Card>
        </MUI.Box>
    );
};

export default TodoCard;

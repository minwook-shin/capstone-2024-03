import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, ButtonGroup, Table, TableBody, TableCell, TableHead, TableRow, Grid, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function VariableManager() {
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const [variables, setVariables] = useState({});

    const handleKeyChange = (event) => {
        setKey(event.target.value);
    };

    const handleValueChange = (event) => {
        setValue(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (key.trim() === '') {
            return;
        }
        const formData = new URLSearchParams();
        formData.append('key', key);
        formData.append('value', value);
        await fetch('http://127.0.0.1:82/vm/var', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });
        setKey('');
        setValue('');
        fetchVariables();
    };

    const fetchVariables = useCallback(async () => {
        const response = await fetch('http://127.0.0.1:82/vm/var');
        const responseData = await response.json();
        setVariables(responseData);
    }, []);

    const clearVariable = async () => {
        await fetch(`http://127.0.0.1:82/vm/vars`, {
            method: 'DELETE'
        });
        setKey('');
        setValue('');
        fetchVariables();
    }
    const deleteVariable = async (key) => {
        await fetch(`http://127.0.0.1:82/vm/var/${key}`, {
            method: 'DELETE'
        });
        fetchVariables();
    };
    const handleKeyClick = (key) => {
        const str = `{{_local['${key}']}}`;
        navigator.clipboard.writeText(str);
        alert(`Copied ${str} to clipboard`);
    };

    useEffect(() => {
        fetchVariables();
    }, [fetchVariables]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Grid container>
                    <Grid item xs={6}>
                        <TextField fullWidth variant="standard" value={key} onChange={handleKeyChange} placeholder="Key" />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth variant="standard" value={value} onChange={handleValueChange} placeholder="Value" />
                    </Grid>
                </Grid>
                <ButtonGroup   variant="text" aria-label="Basic button group" sx={{ display: 'flex' }} fullWidth color="primary">
                    <Button type="submit"><CheckIcon/></Button>
                    <Button onClick={fetchVariables}><RefreshIcon/></Button>
                    <Button onClick={clearVariable}><ClearIcon/></Button>
                </ButtonGroup>
                {Object.keys(variables).length > 0 && (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>변수명</TableCell>
                                    <TableCell>값</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(variables).map(([key, value]) => (
                                    <TableRow key={key}>
                                        <Tooltip title="클릭하시면 변수를 바로 사용할 수 있도록 복사해드려요." placement="bottom-start" arrow>
                                        <TableCell onClick={() => handleKeyClick(key)}><ContentCopyIcon fontSize="small" style={{ verticalAlign: 'middle' }}/> {key}</TableCell>
                                        </Tooltip>
                                        <Tooltip title={value} placement="right-start" arrow>
                                        <TableCell>{value.length > 8 ? value.substring(0, 8) + '...' : value}</TableCell>
                                        </Tooltip>
                                        <TableCell><Button variant="outlined" onClick={() => deleteVariable(key)}><DeleteForeverIcon/></Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                )}
            </form>
        </div>
    );
}

export default VariableManager;
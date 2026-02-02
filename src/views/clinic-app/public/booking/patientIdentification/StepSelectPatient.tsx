'use client'
import Alert from '@mui/material/Alert'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

type Props = {
    foundPatients: any[];
    onSelect: (patient: any) => void;
    onRegisterNew: () => void;
    onCancel: () => void;
}

const StepSelectPatient = ({ foundPatients, onSelect, onRegisterNew, onCancel }: Props) => {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in">
        <Alert severity="info">Multiple profiles found. Please select yours.</Alert>
        <div className="bg-gray-50 border rounded-lg overflow-hidden">
            <List className="p-0">
                {foundPatients.map((patient, index) => (
                    <div key={patient.id}>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => onSelect(patient)} className="hover:bg-blue-50 py-3">
                                <div className="flex items-center gap-4 w-full">
                                    <Avatar sx={{ bgcolor: 'primary.light' }}>{patient.firstName.charAt(0)}</Avatar>
                                    <div className="flex flex-col flex-1">
                                        <Typography className="font-semibold text-gray-800">
                                            {patient.firstName} {patient.lastName}
                                        </Typography>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                                            <span className="bg-white px-2 py-0.5 rounded border">ID: {patient.patientNo}</span>
                                            <span className="bg-white px-2 py-0.5 rounded border">NIC: {patient.nic}</span>
                                        </div>
                                    </div>
                                    <Button size="small" variant="contained" className="ml-2">Select</Button>
                                </div>
                            </ListItemButton>
                        </ListItem>
                        {index < foundPatients.length - 1 && <Divider component="li" />}
                    </div>
                ))}
            </List>
        </div>
        <div className='flex gap-3 justify-between mt-2 items-center'>
            <Button onClick={onRegisterNew} variant="text" color="primary">Not here? Register New</Button>
            <Button onClick={onCancel} color="inherit" variant="outlined">Cancel</Button>
        </div>
    </div>
  )
}
export default StepSelectPatient
'use client'
import { useState } from 'react'

// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// React Hook Form Imports
import { useForm, FormProvider } from 'react-hook-form'


// Third-party Imports
import classnames from 'classnames'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import type { Editor } from '@tiptap/core'

// Components Imports
import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'

import AsyncAutocomplete from '@/components/form-components/AsyncAutocompleteProps'

// Data Imports
import { db } from '../../../../../fake-db/apps/userList'
import SheduleVariants from './SheduleVariants'




const SheduleInformation = () => {

  const [selectedDoctor, setSelectedDoctor] = useState<Record<string, unknown> | null>(null)

    // 1. Initialize React Hook Form
    const methods = useForm()
  
    // 2. This function will receive all form data from all children
    const onSubmit = (data:any) => {
  
      // Send data to your API here
    }

  return (
    <FormProvider {...methods}>    
    <form onSubmit={methods.handleSubmit(onSubmit)}>
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Doctor Information' />
          <CardContent>
            <Grid container spacing={6} className='mbe-6'>
              <Grid size={{ xs: 12 }}>
                <AsyncAutocomplete
                  label="Search Doctor"
                  fetchUrl="/api/search-doctors"
                  searchQueryParam='name'
                  // otherPrams={`status=active&abe=${"ddf"}`} 
                  placeholder="Enter Name"
                  value={selectedDoctor}
                  onChange={(newValue) => {
                    setSelectedDoctor(newValue)
                    console.log(newValue)
                  }}
                  fullWidth
                />
              </Grid>
              {
                selectedDoctor && <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField 
                  fullWidth  
                  label='Read Only'
                  defaultValue={selectedDoctor?.fullName as string || ''}
                  // id='form-props-read-only-input'
                  slotProps={{
                    htmlInput: { readOnly: true }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField 
                  fullWidth  
                  label='Read Only'
                  defaultValue={selectedDoctor?.company as string || ''}
                  // id='form-props-read-only-input'
                  slotProps={{
                    htmlInput: { readOnly: true }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField 
                  fullWidth  
                  label='Read Only'
                  defaultValue={selectedDoctor?.country as string || ''}
                  // id='form-props-read-only-input'
                  slotProps={{
                    htmlInput: { readOnly: true }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField 
                  fullWidth  
                  label='Read Only'
                  defaultValue={selectedDoctor?.contact as string || ''}
                  // id='form-props-read-only-input'
                  slotProps={{
                    htmlInput: { readOnly: true }
                  }}
                />
              </Grid> 
                </>
                
              }
                                        
            </Grid>
        
            {/* <Typography className='mbe-1'>Description (Optional)</Typography> */}
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12 }}>
       <SheduleVariants />
      </Grid> 
    </Grid>
    </form>
    </FormProvider>
  )
}

export default SheduleInformation

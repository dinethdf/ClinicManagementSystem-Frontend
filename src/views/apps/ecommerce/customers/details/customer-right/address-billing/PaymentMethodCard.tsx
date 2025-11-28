// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import type { ButtonProps } from '@mui/material/Button'
import type { IconButtonProps } from '@mui/material/IconButton'


import OptionMenu from '@core/components/option-menu'
import AddNewCard from '@/components/dialogs/add-insurance'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

type dataType = {
  typeOfCard: string
  isDefaultCard: boolean
  expiryDate: string
}

const data: dataType[] = [
  {
    typeOfCard: 'Mastercard',
    isDefaultCard: true,
    expiryDate: 'Apr 2028'
  }
]

// Vars
const editCardData = {
  cardNumber: '**** **** **** 4487',
  name: 'Violet Mendoza ',
  expiryDate: '04/2028',
  cardCvv: '233'
}

const CustomerAddress = (props: dataType) => {
  // Props
  const { isDefaultCard, expiryDate } = props

  // States
  const [expanded, setExpanded] = useState(isDefaultCard ? true : false)

  // Vars
  const iconButtonProps: IconButtonProps = {
    children: <i className='tabler-edit' />,
    className: 'text-textSecondary'
  }

  // Hooks
  const theme = useTheme()

  return (
    <>
      <div className='flex flex-wrap justify-between items-center mlb-3 gap-y-2'>
        <div className='flex items-center gap-2'>
          <IconButton
            size='large'
            sx={{
              '& i': {
                transition: 'transform 0.3s',
                transform: expanded ? 'rotate(0deg)' : theme.direction === 'ltr' ? 'rotate(-90deg)' : 'rotate(90deg)'
              }
            }}
            onClick={() => setExpanded(!expanded)}
          >
            <i className='tabler-chevron-down text-textPrimary' />
          </IconButton>
          <div className='flex items-center gap-4'>
            <div className='flex justify-center items-center bg-[#F6F8FA] rounded-sm is-[50px] bs-[30px]'>
              {/* <img
                src={
                  typeOfCard === 'Mastercard' ? mastercard : typeOfCard === 'American Express' ? americanExpress : visa
                }
                alt={typeOfCard}
                height={typeOfCard === 'Mastercard' ? 19 : typeOfCard === 'American Express' ? 16 : 12}
              /> */}
            </div>
            <div className='flex flex-col items-start gap-1'>
              <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                <Typography color='text.primary' className='font-medium'>
                  HealthCare Insurance
                </Typography>
                {/* {isDefaultCard && <Chip variant='tonal' color='success' label='Default Card' size='small' />} */}
              </div>
              <Typography>Expires {expiryDate}</Typography>
            </div>
          </div>
        </div>
        <div className='mis-10'>
          <OpenDialogOnElementClick
            element={IconButton}
            elementProps={iconButtonProps}
            dialog={AddNewCard}
            dialogProps={{ data: editCardData }}
          />
          <IconButton>
            <i className='tabler-trash text-textSecondary' />
          </IconButton>
          <OptionMenu
            iconClassName='text-textSecondary'
            iconButtonProps={{ size: 'medium' }}
            options={['Set as Default Card']}
          />
        </div>
      </div>
      <Collapse in={expanded} timeout={300}>
        <Grid container spacing={6} className='pbe-3 pis-12'>
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 4 }}>
                <div className='flex flex-col gap-1'>
                  <Typography variant='body2'>Code</Typography>
                </div>
              </Grid>
              <Grid size={{ xs: 8 }}>
                <div className='flex flex-col gap-1'>
                  <Typography variant='body2' color='text.primary' className='font-medium'>
                     #157-PE9871-541
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container>
              <Grid size={{ xs: 4 }}>
                <div className='flex flex-col gap-1'>
                  <Typography variant='body2'>Company</Typography>
                </div>
              </Grid>
              <Grid size={{ xs: 8 }}>
                <div className='flex flex-col gap-1'>
                  <Typography variant='body2' color='text.primary' className='font-medium'>
                    ABCD
                  </Typography>

                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Collapse>
    </>
  )
}

const PaymentMethod = () => {
  // Vars
  const buttonProps: ButtonProps = {
    variant: 'tonal',
    children: 'New Payment Methods',
    size: 'small'
  }

  return (
    <Card>
      <CardHeader
        title='Insurance Overview'
        action={<OpenDialogOnElementClick element={Button} elementProps={buttonProps} dialog={AddNewCard} />}
        className='flex-wrap gap-4'
      />
      <CardContent>
        {data.map((address, index) => (
          <div key={index}>
            <CustomerAddress {...address} />
            {index !== data.length - 1 && <Divider />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default PaymentMethod

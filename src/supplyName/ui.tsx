import {
  render,
  Container,
  Text,
  Bold,
  Divider,
  VerticalSpace,
  Button,
  SegmentedControl,
  SegmentedControlOption,
} from '@create-figma-plugin/ui'
import { h, JSX, options } from 'preact'
import { emit } from '@create-figma-plugin/utilities'
import { useCallback, useState } from 'preact/hooks'
import { NameHandler } from './main'

function Plugin(props: { lastOrder: string; lastGender: string }) {
  const [orderValue, setOrderValue] = useState(props.lastOrder || 'random')
  function handleOrderChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setOrderValue(newValue)
  }
  const [genderValue, setGenderValue] = useState(props.lastGender || 'all')
  function handleGenderChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setGenderValue(newValue)
  }
  const orderOptions: Array<SegmentedControlOption> = [
    { value: 'random', children: 'Random' },
    { value: 'ascending', children: 'A -> Z' },
    { value: 'descending', children: 'Z -> A' },
  ]
  const genderOptions: Array<SegmentedControlOption> = [
    { value: 'all', children: 'All' },
    { value: 'female', children: 'Female' },
    { value: 'male', children: 'Male' },
  ]
  const options = {
    order: orderValue,
    gender: genderValue,
  }
  const handleFullNameButtonClick = useCallback(() => {
    emit<NameHandler>('FULL_NAME', options)
  }, [options])
  const handleFirstNameButtonClick = useCallback(() => {
    emit<NameHandler>('FIRST_NAME', options)
  }, [options])
  const handleLastNameButtonClick = useCallback(() => {
    emit<NameHandler>('LAST_NAME', options)
  }, [options])
  const handleLastFirstButtonClick = useCallback(() => {
    emit<NameHandler>('LAST_FIRST', options)
  }, [options])
  const handleShorNameButtonClick = useCallback(() => {
    emit<NameHandler>('FIRST_L', options)
  }, [options])
  return (
    <Container space="medium">
      <VerticalSpace space="medium" />
      <Text><Bold>Gender</Bold></Text>
      <VerticalSpace space="small" />
      <SegmentedControl
        name="gender"
        onChange={handleGenderChange}
        options={genderOptions}
        value={genderValue}
      />
      <VerticalSpace space="medium" />
      <Text><Bold>Order</Bold></Text>
      <VerticalSpace space="small" />
      <SegmentedControl
        name="order"
        onChange={handleOrderChange}
        options={orderOptions}
        value={orderValue}
      />
      <VerticalSpace space="large" />
      <Button secondary fullWidth onClick={handleFullNameButtonClick}>
        First Last
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleFirstNameButtonClick}>
        First
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleLastNameButtonClick}>
        Last
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleLastFirstButtonClick}>
        Last, First
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleShorNameButtonClick}>
        First L.
      </Button>
    </Container>
  )
}

export default render(Plugin)

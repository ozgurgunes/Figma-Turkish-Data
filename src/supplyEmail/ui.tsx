import {
  render,
  Container,
  Text,
  Bold,
  Columns,
  VerticalSpace,
  Button,
  Textbox,
  SegmentedControl,
  SegmentedControlOption,
} from '@create-figma-plugin/ui'
import { h, JSX } from 'preact'
import { emit } from '@create-figma-plugin/utilities'
import { useCallback, useState } from 'preact/hooks'
import { EmailHandler, PluginOptions } from './main'

function Plugin(props: PluginOptions) {
  const [orderValue, setOrderValue] = useState(props.order || 'random')
  const [genderValue, setGenderValue] = useState(props.gender || 'all')
  const [domainValue, setDomainValue] = useState(props.domain)
  function handleOrderChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setOrderValue(newValue)
  }
  function handleGenderChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setGenderValue(newValue)
  }
  function handleDomainChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setDomainValue(newValue)
  }
  const orderOptions: Array<SegmentedControlOption> = [
    { value: 'random', children: 'Random' },
    { value: 'ascending', children: '0 -> 9' },
    { value: 'descending', children: '9 -> 0' },
  ]
  const genderOptions: Array<SegmentedControlOption> = [
    { value: 'all', children: 'All' },
    { value: 'female', children: 'Female' },
    { value: 'male', children: 'Male' },
  ]
  const options = {
    order: orderValue,
    gender: genderValue,
    domain: domainValue,
  }

  const handleFirstLastButtonClick = useCallback(() => {
    emit<EmailHandler>('FIRST_LAST', options)
  }, [options])
  const handleFirstDotLastButtonClick = useCallback(() => {
    emit<EmailHandler>('FIRST_DOT_LAST', options)
  }, [options])
  const handleFDotLastButtonClick = useCallback(() => {
    emit<EmailHandler>('F_DOT_LAST', options)
  }, [options])
  const handleFLastButtonClick = useCallback(() => {
    emit<EmailHandler>('F_LAST', options)
  }, [options])
  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      <Text>
        <Bold>Gender</Bold>
      </Text>
      <VerticalSpace space="small" />
      <SegmentedControl
        name="gender"
        onChange={handleGenderChange}
        options={genderOptions}
        value={genderValue}
      />
      <VerticalSpace space="medium" />
      <Text>
        <Bold>Order</Bold>
      </Text>
      <VerticalSpace space="small" />
      <SegmentedControl
        name="order"
        onChange={handleOrderChange}
        options={orderOptions}
        value={orderValue}
      />
      <VerticalSpace space="large" />
      <Text>
        <Bold>Domain</Bold>
      </Text>
      <VerticalSpace space="extraSmall" />
      <Textbox
        onInput={handleDomainChange}
        placeholder="Random (Public)"
        value={domainValue}
      />
      <VerticalSpace space="large" />
      <Button secondary fullWidth onClick={handleFirstLastButtonClick}>
        firstlast
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleFirstDotLastButtonClick}>
        first.last
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleFDotLastButtonClick}>
        f.last
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleFLastButtonClick}>
        flast
      </Button>
      <VerticalSpace space="medium" />
    </Container>
  )
}

export default render(Plugin)

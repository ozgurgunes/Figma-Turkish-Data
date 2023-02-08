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
import { PhoneHandler, PluginOptions } from './main'

function Plugin(props: PluginOptions) {
  const [orderValue, setOrderValue] = useState(props.order || 'random')
  const [countryValue, setCountryValue] = useState(props.country)
  const [areaValue, setAreaValue] = useState(props.area)
  function handleOrderChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setOrderValue(newValue)
  }
  function handleCountryChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setCountryValue(newValue)
  }
  function handleAreaChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setAreaValue(newValue)
  }
  const orderOptions: Array<SegmentedControlOption> = [
    { value: 'random', children: 'Random' },
    { value: 'ascending', children: '0 -> 9' },
    { value: 'descending', children: '9 -> 0' },
  ]
  const options = {
    order: orderValue,
    country: countryValue,
    area: areaValue,
  }

  const handlePlusCountryParenthesisButtonClick = useCallback(() => {
    emit<PhoneHandler>('PLUS_COUNTRY_PARENTHESIS', options)
  }, [options])
  const handlePlusCountrySimpleButtonClick = useCallback(() => {
    emit<PhoneHandler>('PLUS_COUNTRY_SIMPLE', options)
  }, [options])
  const handleCountryParenthesisButtonClick = useCallback(() => {
    emit<PhoneHandler>('COUNTRY_PARENTHESIS', options)
  }, [options])
  const handleCountrySimpleButtonClick = useCallback(() => {
    emit<PhoneHandler>('COUNTRY_SIMPLE', options)
  }, [options])
  const handleAreaParenthesisButtonClick = useCallback(() => {
    emit<PhoneHandler>('AREA_PARENTHESIS', options)
  }, [options])
  const handleAreaSimpleButtonClick = useCallback(() => {
    emit<PhoneHandler>('AREA_SIMPLE', options)
  }, [options])
  const handlePlusCountryCombinedButtonClick = useCallback(() => {
    emit<PhoneHandler>('PLUS_COUNTRY_COMBINED', options)
  }, [options])
  const handleCountryCombinedButtonClick = useCallback(() => {
    emit<PhoneHandler>('COUNTRY_COMBINED', options)
  }, [options])
  const handleAreaCombinedButtonClick = useCallback(() => {
    emit<PhoneHandler>('AREA_COMBINED', options)
  }, [options])
  return (
    <Container space="medium">
      <VerticalSpace space="large" />
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
      <VerticalSpace space="medium" />
      <Columns space="medium">
        <div>
          <Text>
            <Bold>Country</Bold>
          </Text>
          <VerticalSpace space="extraSmall" />
          <Textbox onInput={handleCountryChange} placeholder="Random (1-99)" value={countryValue} />
        </div>
        <div>
          <Text>
            <Bold>Area</Bold>
          </Text>
          <VerticalSpace space="extraSmall" />
          <Textbox onInput={handleAreaChange} placeholder="Random (5XX)" value={areaValue} />
        </div>
      </Columns>
      <VerticalSpace space="large" />
      <Button secondary fullWidth onClick={handlePlusCountryParenthesisButtonClick}>
        +XX (XXX) XXXXXXX
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleCountrySimpleButtonClick}>
        +XX XXX XXXXXXX
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleCountryParenthesisButtonClick}>
        XX (XXX) XXXXXXX
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleCountrySimpleButtonClick}>
        XX XXX XXXXXXX
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleAreaParenthesisButtonClick}>
        (XXX) XXXXXXX
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleAreaSimpleButtonClick}>
        XXX XXXXXXX
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handlePlusCountryCombinedButtonClick}>
        +XXXXXXXXXXXX
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleCountryCombinedButtonClick}>
        XXXXXXXXXXXX
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleAreaCombinedButtonClick}>
        XXXXXXXXXX
      </Button>
      <VerticalSpace space="medium" />
    </Container>
  )
}

export default render(Plugin)

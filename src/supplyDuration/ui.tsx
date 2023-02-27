import {
  render,
  Container,
  Text,
  Bold,
  VerticalSpace,
  Button,
  Columns,
  DropdownOption,
  Dropdown,
  SegmentedControl,
  SegmentedControlOption,
  TextboxNumeric,
} from '@create-figma-plugin/ui'
import { h, JSX } from 'preact'
import { emit } from '@create-figma-plugin/utilities'
import { useCallback, useState } from 'preact/hooks'
import { DateHandler, PluginOptions } from './main'
import { turkishDuration } from '../utils'

function Plugin(props: PluginOptions) {
  const [orderValue, setOrderValue] = useState(props.order || 'random')
  const [minValue, setMinValue] = useState(props.min_value || '1')
  const [minUnitValue, setMinUnitValue] = useState(props.min_unit || '3600000')
  const [maxValue, setMaxValue] = useState(props.max_value || '2')
  const [maxUnitValue, setMaxUnitValue] = useState(props.max_unit || '86400000')
  const [durationValue, setDurationValue] = useState(0)
  function handleDurationValue() {
    let min = Number(minValue) * Number(minUnitValue)
    let max = Number(maxValue) * Number(maxUnitValue)
    setDurationValue(Math.floor(Math.random() * (max - min) + min))
  }

  function handleOrderChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setOrderValue(newValue)
    handleDurationValue()
  }
  function handleMinValueChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setMinValue(newValue)
    handleDurationValue()
  }
  function handleMinUnitValueChange(
    event: JSX.TargetedEvent<HTMLInputElement>
  ) {
    const newValue = event.currentTarget.value
    setMinUnitValue(newValue)
    handleDurationValue()
  }
  function handleMaxValueChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setMaxValue(newValue)
    handleDurationValue()
  }
  function handleMaxUnitValueChange(
    event: JSX.TargetedEvent<HTMLInputElement>
  ) {
    const newValue = event.currentTarget.value
    setMaxUnitValue(newValue)
    handleDurationValue()
  }

  const orderOptions: Array<SegmentedControlOption> = [
    { value: 'random', children: 'Random' },
    { value: 'ascending', children: '0 -> 9' },
    { value: 'descending', children: '9 -> 0' },
  ]
  const unitOptions: Array<DropdownOption> = [
    { value: '60000', text: 'Dakika' },
    { value: '3600000', text: 'Saat' },
    { value: '86400000', text: 'Gün' },
    { value: '604800000', text: 'Hafta' },
    { value: '2592000000', text: 'Ay' },
    { value: '31536000000', text: 'Yıl' },
  ]
  const options = {
    order: orderValue,
    min_value: minValue,
    min_unit: minUnitValue,
    max_value: maxValue,
    max_unit: maxUnitValue,
  }
  const handleBasicButtonClick = useCallback(() => {
    emit<DateHandler>('BASIC', options)
  }, [options])
  const handleShortButtonClick = useCallback(() => {
    emit<DateHandler>('SHORT', options)
  }, [options])
  return (
    <Container space="medium">
      <VerticalSpace space="medium" />
      <Columns space="small">
        <div>
          <Text>
            <Bold>Min.</Bold>
          </Text>
          <VerticalSpace space="small" />
          <Columns>
            <TextboxNumeric
              onInput={handleMinValueChange}
              value={minValue}
              variant="border"
              style="width: 24px"
            />
            <Dropdown
              style="width: max-content"
              onChange={handleMinUnitValueChange}
              options={unitOptions}
              value={minUnitValue}
            />
          </Columns>
        </div>
        <div>
          <Text>
            <Bold>Max.</Bold>
          </Text>
          <VerticalSpace space="small" />
          <Columns>
            <TextboxNumeric
              onInput={handleMaxValueChange}
              value={maxValue}
              variant="border"
              style="width: 24px"
            />
            <Dropdown
              onChange={handleMaxUnitValueChange}
              options={unitOptions}
              value={maxUnitValue}
            />
          </Columns>
        </div>
      </Columns>
      <VerticalSpace space="large" />
      <Text>
        <Bold>Order</Bold>
      </Text>
      <VerticalSpace space="extraSmall" />
      <SegmentedControl
        onChange={handleOrderChange}
        options={orderOptions}
        value={orderValue}
      />

      <VerticalSpace space="large" />
      <Button secondary fullWidth onClick={handleBasicButtonClick}>
        {durationValue == 0
          ? 'Basic'
          : turkishDuration.basic(Math.floor(Math.random() * durationValue))}
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleShortButtonClick}>
        {durationValue == 0
          ? 'Short'
          : turkishDuration.short(Math.floor(Math.random() * durationValue))}
      </Button>
      <VerticalSpace space="medium" />
    </Container>
  )
}

export default render(Plugin)

import {
  render,
  Container,
  Text,
  VerticalSpace,
  Button,
  Divider,
  SegmentedControl,
  SegmentedControlOption,
  Textbox,
} from '@create-figma-plugin/ui'
import { h, JSX } from 'preact'
import { emit } from '@create-figma-plugin/utilities'
import { useCallback, useState } from 'preact/hooks'
import { DateHandler } from './main'

function Plugin(props: { lastOrder: string, lastRange: string }) {
  const [orderValue, setOrderValue] = useState(props.lastOrder || 'random')
  const [rangeValue, setRangeValue] = useState(props.lastRange || 'year')
  const [startValue, setStartValue] = useState((new Date().toLocaleString()))
  function handleOrderChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setOrderValue(newValue)
  }
  function handleRangeChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setRangeValue(newValue)
  }
  function handleStart(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setStartValue(newValue)
  }
  const orderOptions: Array<SegmentedControlOption> = [
    { value: 'random', children: 'Random' },
    { value: 'ascending', children: '0 -> 9' },
    { value: 'descending', children: '9 -> 0' },
  ]
  const rangeOptions: Array<SegmentedControlOption> = [
    { value: 'year', children: 'year' },
    { value: 'month', children: 'month' },
    { value: 'hour', children: 'hour' },
    { value: 'day', children: 'day' },
  ]
  const options = {
    order: orderValue,
    range: rangeValue,
    start: startValue
  }

  const handleHhMmButtonClick = useCallback(() => {
    emit<DateHandler>('HHMM', options)
  }, [options])
  const handleHhMmSsButtonClick = useCallback(() => {
    emit<DateHandler>('HHMMSS', options)
  }, [options])
  const handleDdMmYYButtonClick = useCallback(() => {
    emit<DateHandler>('DDMMYY', options)
  }, [options])
  const handleDdMmYyyyButtonClick = useCallback(() => {
    emit<DateHandler>('DDMMYYYY', options)
  }, [options])
  const handleDdMmmYyyyButtonClick = useCallback(() => {
    emit<DateHandler>('DDMMMYYYY', options)
  }, [options])
  const handleDdMmmmYyyyButtonClick = useCallback(() => {
    emit<DateHandler>('DDMMMMYYYY', options)
  }, [options])
  const handleDdMmmmYyyyDdddButtonClick = useCallback(() => {
    emit<DateHandler>('DDMMMMYYYYDDDD', options)
  }, [options])
  const handleDdMmYyHhMmButtonClick = useCallback(() => {
    emit<DateHandler>('DDMMYYHHMM', options)
  }, [options])
  const handleDdMmYyyyHhMmButtonClick = useCallback(() => {
    emit<DateHandler>('DDMMYYYYHHMM', options)
  }, [options])
  const handleDdMmmmYyyyDdddHhMmButtonClick = useCallback(() => {
    emit<DateHandler>('DDMMMMYYYYDDDDHHMM', options)
  }, [options])
  return (
    <Container space="medium">
      <VerticalSpace space="medium" />
      <Text bold>Start</Text>
      <VerticalSpace space="extraSmall" />
      <Textbox onInput={handleStart} value={startValue} />      
      <VerticalSpace space="medium" />
      <Text bold>Range</Text>
      <VerticalSpace space="extraSmall" />
      <SegmentedControl
        onChange={handleRangeChange}
        options={rangeOptions}
        value={rangeValue}
      />
      <VerticalSpace space="medium" />
      <Text bold>Order</Text>
      <VerticalSpace space="extraSmall" />
      <SegmentedControl
        onChange={handleOrderChange}
        options={orderOptions}
        value={orderValue}
      />
      <VerticalSpace space="medium" />
      <Divider />
      <VerticalSpace space="medium" />
      <Button secondary fullWidth onClick={handleHhMmButtonClick}>
        HH:mm
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleHhMmSsButtonClick}>
        HH:mm:SS
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDdMmYYButtonClick}>
        dd.MM.yy
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDdMmYyyyButtonClick}>
        dd.MM.yyyy
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDdMmmYyyyButtonClick}>
        dd MMM yyyy
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDdMmmmYyyyButtonClick}>
        dd MMMM yyyy
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDdMmmmYyyyDdddButtonClick}>
        dd MMMM yyyy dddd
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDdMmYyHhMmButtonClick}>
        dd.MM.yy HH:mm
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDdMmYyyyHhMmButtonClick}>
        dd.MM.yyyy HH:mm
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDdMmmmYyyyDdddHhMmButtonClick}>
        dd MMMM yyyy dddd HH:mm{' '}
      </Button>
      <VerticalSpace space="medium" />
    </Container>
  )
}

export default render(Plugin)

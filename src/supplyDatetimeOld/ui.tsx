import {
  render,
  Container,
  Text,
  Bold,
  VerticalSpace,
  Button,
  SegmentedControl,
  SegmentedControlOption,
} from '@create-figma-plugin/ui'
import { h, JSX } from 'preact'
import { emit } from '@create-figma-plugin/utilities'
import { useCallback, useState } from 'preact/hooks'
import { DateHandler, PluginOptions, DateFormat } from './main'
import { dateTimeFormats, formatDate, formatTime } from '../utils'
import DatePicker from 'react-datepicker'
import '!react-datepicker/dist/react-datepicker.css'
import '!../styles.css'

function Plugin(props: PluginOptions) {
  const [orderValue, setOrderValue] = useState(props.order || 'random')
  const [rangeValue, setRangeValue] = useState(props.range || 'year')
  const [startValue, setStartValue] = useState(new Date().toLocaleString())
  const [dateValue, setDateValue] = useState(new Date())

  function handleOrderChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setOrderValue(newValue)
  }
  function handleRangeChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setRangeValue(newValue)
  }
  function handleDateChange(date: Date) {
    setDateValue(date)
    setStartValue(date.toString())
  }

  const orderOptions: Array<SegmentedControlOption> = [
    { value: 'random', children: 'Random' },
    { value: 'ascending', children: '0 -> 9' },
    { value: 'descending', children: '9 -> 0' },
  ]
  const rangeOptions: Array<SegmentedControlOption> = [
    { value: 'year', children: 'Year' },
    { value: 'month', children: 'Month' },
    { value: 'day', children: 'Day' },
    { value: 'hour', children: 'Hour' },
  ]
  const options = {
    order: orderValue,
    range: rangeValue,
    start: startValue,
  }
  function getFormat(format: DateFormat) {
    return dateTimeFormats[format]
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
      <Text>
        <Bold>Range</Bold>
      </Text>
      <VerticalSpace space="extraSmall" />
      <SegmentedControl
        onChange={handleRangeChange}
        options={rangeOptions}
        value={rangeValue}
      />
      <VerticalSpace space="medium" />
      <Text>
        <Bold>Order</Bold>
      </Text>
      <VerticalSpace space="extraSmall" />
      <SegmentedControl
        onChange={handleOrderChange}
        options={orderOptions}
        value={orderValue}
      />
      <VerticalSpace space="medium" />
      <Text>
        <Bold>Start Date</Bold>
      </Text>
      <VerticalSpace space="extraSmall" />
      <DatePicker
        selected={dateValue}
        onChange={(date: Date) => handleDateChange(date)}
        //showTimeSelect
        inline
        showTimeInput
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        calendarStartDay={1}
      />
      <VerticalSpace space="large" />
      <Button secondary fullWidth onClick={handleHhMmButtonClick}>
        {formatTime(dateValue, getFormat('HhMm'))}
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleHhMmSsButtonClick}>
        {formatTime(dateValue, getFormat('HhMmSs'))}
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDdMmYYButtonClick}>
        {formatDate(dateValue, getFormat('DdMmYY'))}
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDdMmYyyyButtonClick}>
        {formatDate(dateValue, getFormat('DdMmYyyy'))}
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDdMmmYyyyButtonClick}>
        {formatDate(dateValue, getFormat('DdMmmYyyy'))}
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDdMmmmYyyyButtonClick}>
        {formatDate(dateValue, getFormat('DdMmmmYyyy'))}
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDdMmmmYyyyDdddButtonClick}>
        {formatDate(dateValue, getFormat('DdMmmmYyyyDddd'))}
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDdMmYyHhMmButtonClick}>
        {formatDate(dateValue, getFormat('DdMmYyHhMm'))}
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDdMmYyyyHhMmButtonClick}>
        {formatDate(dateValue, getFormat('DdMmYyyyHhMm'))}
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDdMmmmYyyyDdddHhMmButtonClick}>
        {formatDate(dateValue, getFormat('DdMmmmYyyyDdddHhMm'))}
      </Button>
      <VerticalSpace space="medium" />
    </Container>
  )
}

export default render(Plugin)

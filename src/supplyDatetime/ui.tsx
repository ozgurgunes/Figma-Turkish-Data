import {
  render,
  Container,
  Text,
  Bold,
  VerticalSpace,
  Button,
  Columns,
  Divider,
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
  const [endValue, setEndValue] = useState(new Date(props.end).toLocaleString())
  const [startValue, setStartValue] = useState(new Date(props.start).toLocaleString())
  const [startDateValue, setStartDateValue] = useState(new Date(props.start))
  const [endDateValue, setEndDateValue] = useState(new Date(props.end))

  function handleOrderChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setOrderValue(newValue)
  }
  function handleStartDateChange(date: Date) {
    setStartDateValue(date)
    setStartValue(date.toString())
  }
  function handleEndDateChange(date: Date) {
    setEndDateValue(date)
    setEndValue(date.toString())
  }

  const orderOptions: Array<SegmentedControlOption> = [
    { value: 'random', children: 'Random' },
    { value: 'ascending', children: '0 -> 9' },
    { value: 'descending', children: '9 -> 0' },
  ]
  const options = {
    order: orderValue,
    start: startValue,
    end: endValue,
  }
  function getFormat(format: DateFormat) {
    return dateTimeFormats[format]
  }
  const handleHhMmOsButtonClick = useCallback(() => {
    emit<DateHandler>('HHMMOS', options)
  }, [options])
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
      <Columns space="medium">
        <div style="width: 200px">
          <Text>
            <Bold>Start Date</Bold>
          </Text>
          <VerticalSpace space="small" />
          <DatePicker
            selected={startDateValue}
            onChange={(date: Date) => handleStartDateChange(date)}
            //showTimeSelect
            inline
            showTimeInput
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            calendarStartDay={1}
          />
          <VerticalSpace space="medium" />
          <Text>
            <Bold>End Date</Bold>
          </Text>
          <VerticalSpace space="small" />
          <DatePicker
            selected={endDateValue}
            onChange={(date: Date) => handleEndDateChange(date)}
            //showTimeSelect
            inline
            showTimeInput
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            calendarStartDay={1}
          />
        </div>
        <div style="width: 216px">
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
          <Button secondary fullWidth onClick={handleHhMmOsButtonClick}>
            {formatTime(startDateValue, getFormat('HhMmOs'))}
          </Button>
          <VerticalSpace space="extraSmall" />
          <Button secondary fullWidth onClick={handleHhMmButtonClick}>
            {formatTime(startDateValue, getFormat('HhMm'))}
          </Button>
          <VerticalSpace space="extraSmall" />
          <Button secondary fullWidth onClick={handleHhMmSsButtonClick}>
            {formatTime(startDateValue, getFormat('HhMmSs'))}
          </Button>
          <VerticalSpace space="large" />
          <Button secondary fullWidth onClick={handleDdMmYYButtonClick}>
            {formatDate(startDateValue, getFormat('DdMmYY'))}
          </Button>
          <VerticalSpace space="extraSmall" />
          <Button secondary fullWidth onClick={handleDdMmYyyyButtonClick}>
            {formatDate(startDateValue, getFormat('DdMmYyyy'))}
          </Button>
          <VerticalSpace space="extraSmall" />
          <Button secondary fullWidth onClick={handleDdMmmYyyyButtonClick}>
            {formatDate(startDateValue, getFormat('DdMmmYyyy'))}
          </Button>
          <VerticalSpace space="extraSmall" />
          <Button secondary fullWidth onClick={handleDdMmmmYyyyButtonClick}>
            {formatDate(startDateValue, getFormat('DdMmmmYyyy'))}
          </Button>
          <VerticalSpace space="extraSmall" />
          <Button secondary fullWidth onClick={handleDdMmmmYyyyDdddButtonClick}>
            {formatDate(startDateValue, getFormat('DdMmmmYyyyDddd'))}
          </Button>
          <VerticalSpace space="large" />
          <Button secondary fullWidth onClick={handleDdMmYyHhMmButtonClick}>
            {formatDate(startDateValue, getFormat('DdMmYyHhMm'))}
          </Button>
          <VerticalSpace space="extraSmall" />
          <Button secondary fullWidth onClick={handleDdMmYyyyHhMmButtonClick}>
            {formatDate(startDateValue, getFormat('DdMmYyyyHhMm'))}
          </Button>
          <VerticalSpace space="extraSmall" />
          <Button
            secondary
            fullWidth
            onClick={handleDdMmmmYyyyDdddHhMmButtonClick}
          >
            {formatDate(startDateValue, getFormat('DdMmmmYyyyDdddHhMm'))}
          </Button>
        </div>
      </Columns>
      <VerticalSpace space="medium" />
    </Container>
  )
}

export default render(Plugin)

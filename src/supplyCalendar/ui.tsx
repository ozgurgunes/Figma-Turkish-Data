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
import { DateHandler, PluginOptions } from './main'
import DatePicker from 'react-datepicker'
import '!react-datepicker/dist/react-datepicker.css'
import '!../styles.css'

function Plugin(props: PluginOptions) {
  const [orderValue, setOrderValue] = useState(props.order || 'random')
  const [startValue, setStartValue] = useState(new Date().toLocaleString())
  const [dateValue, setDateValue] = useState(new Date())

  function handleOrderChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setOrderValue(newValue)
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
  const options = {
    order: orderValue,
    start: startValue,
    date: dateValue,
  }

  const handleDayNameButtonClick = useCallback(() => {
    emit<DateHandler>('DAY_NAME', options)
  }, [options])
  const handleDayNumberButtonClick = useCallback(() => {
    emit<DateHandler>('DAY_NUMBER', options)
  }, [options])
  const handleMonthNameButtonClick = useCallback(() => {
    emit<DateHandler>('MONTH_NAME', options)
  }, [options])
  const handleMonthNumberButtonClick = useCallback(() => {
    emit<DateHandler>('MONTH_NUMBER', options)
  }, [options])
  const handleDayAndMonthNameButtonClick = useCallback(() => {
    emit<DateHandler>('DAY_AND_MONTH_NAME', options)
  }, [options])
  const handleMonthNameAndYearButtonClick = useCallback(() => {
    emit<DateHandler>('MONTH_NAME_AND_YEAR', options)
  }, [options])
  return (
    <Container space="medium">
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
        inline
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        calendarStartDay={1}
      />
      <VerticalSpace space="large" />
      <Button secondary fullWidth onClick={handleDayNameButtonClick}>
        Day Name
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDayNumberButtonClick}>
        Day Number
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleMonthNameButtonClick}>
        Month Name
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleMonthNumberButtonClick}>
        Month Number
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDayAndMonthNameButtonClick}>
        Day and Month Name
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleMonthNameAndYearButtonClick}>
        Month Name and Year
      </Button>
      <VerticalSpace space="medium" />
    </Container>
  )
}

export default render(Plugin)

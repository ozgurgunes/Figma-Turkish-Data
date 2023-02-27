import {
  render,
  Container,
  Columns,
  Text,
  Bold,
  Textbox,
  Divider,
  VerticalSpace,
  Button,
  SegmentedControl,
  SegmentedControlOption,
} from '@create-figma-plugin/ui'
import { h, JSX } from 'preact'
import { emit } from '@create-figma-plugin/utilities'
import { useCallback, useState } from 'preact/hooks'
import { NameHandler, PluginOptions } from './main'
import { copyToClipboard } from '../utils'

function Plugin(props: PluginOptions) {
  const [orderValue, setOrderValue] = useState(props.order || 'random')
  const [symbolValue, setSymbolValue] = useState(props.symbol || 'none')
  const [decimalValue, setDecimalValue] = useState(props.decimal || 'none')
  const [minValue, setMinValue] = useState(props.min || '1000')
  const [maxValue, setMaxValue] = useState(props.max || '9999')
  const [totalValue, setTotalValue] = useState(props.total || '0')
  function handleOrderChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setOrderValue(newValue)
  }
  function handleSymbolChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setSymbolValue(newValue)
  }
  function handleDecimalChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setDecimalValue(newValue)
  }
  function handleMin(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setMinValue(newValue)
  }
  function handleMax(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setMaxValue(newValue)
  }
  function handleTotal(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setTotalValue(newValue)
  }
  onmessage = event => {
    if ('newTotal' in event.data.pluginMessage) {
      setTotalValue(event.data.pluginMessage.newTotal)
    }
  }
  const orderOptions: Array<SegmentedControlOption> = [
    { value: 'random', children: 'Random' },
    { value: 'ascending', children: '0 -> 9' },
    { value: 'descending', children: '9 -> 0' },
  ]
  const symbolOptions: Array<SegmentedControlOption> = [
    { value: 'sign', children: '₺' },
    { value: 'try', children: 'TRY' },
    { value: 'tl', children: 'TL' },
    { value: 'none', children: 'None' },
  ]
  const decimalOptions: Array<SegmentedControlOption> = [
    { value: 'random', children: 'Random' },
    { value: 'min', children: '00' },
    { value: 'max', children: '99' },
    { value: 'none', children: 'None' },
  ]
  const options = {
    order: orderValue,
    symbol: symbolValue,
    decimal: decimalValue,
    min: minValue,
    max: maxValue,
    total: totalValue,
  }
  const handlePriceButtonClick = useCallback(() => {
    emit<NameHandler>('PRICE', options)
  }, [options])
  const handleSequenceButtonClick = useCallback(() => {
    emit<NameHandler>('SEQUENCE', options)
  }, [options])
  const handleTotalButtonClick = useCallback(() => {
    emit<NameHandler>('TOTAL', options)
    copyToClipboard(totalValue)
  }, [options])
  return (
    <Container space="medium">
      <VerticalSpace space="medium" />
      <Columns space="medium">
        <div>
          <Text>
            <Bold>Min.</Bold>
          </Text>
          <VerticalSpace space="extraSmall" />
          <Textbox onInput={handleMin} value={minValue} />{' '}
        </div>
        <div>
          <Text>
            <Bold>Max.</Bold>
          </Text>
          <VerticalSpace space="extraSmall" />
          <Textbox onInput={handleMax} value={maxValue} />{' '}
        </div>
      </Columns>
      <VerticalSpace space="medium" />
      <Text>
        <Bold>Decimal</Bold>
      </Text>
      <VerticalSpace space="small" />
      <SegmentedControl
        name="decimal"
        onChange={handleDecimalChange}
        options={decimalOptions}
        value={decimalValue}
      />
      <VerticalSpace space="medium" />
      <Text>
        <Bold>Symbol</Bold>
      </Text>
      <VerticalSpace space="small" />
      <SegmentedControl
        name="symbol"
        onChange={handleSymbolChange}
        options={symbolOptions}
        value={symbolValue}
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
      <Button default fullWidth onClick={handlePriceButtonClick}>
        Generate Prices
      </Button>
      <VerticalSpace space="small" />
      <Button secondary fullWidth onClick={handleSequenceButtonClick}>
        Generate Sequence
      </Button>
      <VerticalSpace space="small" />
      <Divider />
      <VerticalSpace space="small" />
      <Button secondary fullWidth onClick={handleTotalButtonClick}>
        Copy Total: {totalValue}
      </Button>
    </Container>
  )
}

export default render(Plugin)

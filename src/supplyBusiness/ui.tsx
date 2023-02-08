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
import { NameHandler, PluginOptions } from './main'

function Plugin(props: PluginOptions) {
  const [orderValue, setOrderValue] = useState(props.order || 'random')
  function handleOrderChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setOrderValue(newValue)
  }
  const orderOptions: Array<SegmentedControlOption> = [
    { value: 'random', children: 'Random' },
    { value: 'ascending', children: 'A -> Z' },
    { value: 'descending', children: 'Z -> A' },
  ]
  const options = {
    order: orderValue,
  }
  const handleBusinessTitleButtonClick = useCallback(() => {
    emit<NameHandler>('BUSINESS_TITLE', options)
  }, [options])
  const handleCompanyNameButtonClick = useCallback(() => {
    emit<NameHandler>('COMPANY_NAME', options)
  }, [options])
  const handleIndustryTitleButtonClick = useCallback(() => {
    emit<NameHandler>('INDUSTRY_TITLE', options)
  }, [options])
  const handleOccupationButtonClick = useCallback(() => {
    emit<NameHandler>('OCCUPATION', options)
  }, [options])
  const handleShopNameButtonClick = useCallback(() => {
    emit<NameHandler>('SHOP_NAME', options)
  }, [options])
  return (
    <Container space="medium">
      <VerticalSpace space="medium" />
      <Text>
        <Bold>Order</Bold>
      </Text>
      <VerticalSpace space="small" />
      <SegmentedControl
        onChange={handleOrderChange}
        options={orderOptions}
        value={orderValue}
      />
      <VerticalSpace space="large" />
      <Button secondary fullWidth onClick={handleBusinessTitleButtonClick}>
        Business Title
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleCompanyNameButtonClick}>
        Company Name
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleIndustryTitleButtonClick}>
        Industry Title
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleOccupationButtonClick}>
        Occupation
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleShopNameButtonClick}>
        Shop Name
      </Button>
      <VerticalSpace space="extraSmall" />
    </Container>
  )
}

export default render(Plugin)

import {
  render,
  Container,
  Text,
  VerticalSpace,
  Button,
  Dropdown,
  DropdownOption,
  SegmentedControl,
  SegmentedControlOption,
  Divider,
} from '@create-figma-plugin/ui'
import { h, JSX } from 'preact'
import { emit } from '@create-figma-plugin/utilities'
import { useCallback, useState } from 'preact/hooks'
import { NameHandler } from './main'

function Plugin(props: { lastOrder: string }) {
  const [orderValue, setOrderValue] = useState(props.lastOrder || 'random')
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
  const handleAddressButtonClick = useCallback(() => {
    emit<NameHandler>('ADDRESS', options)
  }, [options])
  const handleCityButtonClick = useCallback(() => {
    emit<NameHandler>('CITY', options)
  }, [options])
  const handleCountryButtonClick = useCallback(() => {
    emit<NameHandler>('COUNTRY', options)
  }, [options])
  const handleDistrictSlashCityButtonClick = useCallback(() => {
    emit<NameHandler>('DISTRICT_SLASH_CITY', options)
  }, [options])
  const handleDistrictCommaCityButtonClick = useCallback(() => {
    emit<NameHandler>('DISTRICT_COMMA_CITY', options)
  }, [options])
  const handleDistrictsOfAnkaraButtonClick = useCallback(() => {
    emit<NameHandler>('DISTRICTS_OF_ANKARA', options)
  }, [options])
  const handleDistrictsOfIstanbulButtonClick = useCallback(() => {
    emit<NameHandler>('DISTRICTS_OF_ISTANBUL', options)
  }, [options])
  return (
    <Container space="medium">
      <VerticalSpace space="medium" />
      <Text bold>Order</Text>
      <VerticalSpace space="small" />
      <SegmentedControl
        onChange={handleOrderChange}
        options={orderOptions}
        value={orderValue}
      />
      <VerticalSpace space="medium" />
      <Divider />
      <VerticalSpace space="medium" />
      <Button secondary fullWidth onClick={handleAddressButtonClick}>
        Address
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleCityButtonClick}>
        City
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleCountryButtonClick}>
        Country
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDistrictSlashCityButtonClick}>
        District / City
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDistrictCommaCityButtonClick}>
        District, City
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDistrictsOfAnkaraButtonClick}>
        Districts of Ankara
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button
        secondary
        fullWidth
        onClick={handleDistrictsOfIstanbulButtonClick}
      >
        Districts of Istanbul
      </Button>
      <VerticalSpace space="extraSmall" />
    </Container>
  )
}

export default render(Plugin)

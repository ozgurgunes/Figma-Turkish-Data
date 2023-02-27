import {
  render,
  Container,
  Text,
  Bold,
  VerticalSpace,
  Button,
  SegmentedControl,
  SegmentedControlOption,
  DropdownOption,
  Dropdown,
} from '@create-figma-plugin/ui'
import cities from '../turkishData/locationCity'
import { h, JSX } from 'preact'
import { emit } from '@create-figma-plugin/utilities'
import { useCallback, useState } from 'preact/hooks'
import { NameHandler, PluginOptions } from './main'

function Plugin(props: PluginOptions) {
  const [pickValue, setPickValue] = useState(props.pick || 'randomized')
  const [orderValue, setOrderValue] = useState(props.order || 'random')
  const [cityValue, setCityValue] = useState(props.city || '')
  function handleOrderChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setOrderValue(newValue)
  }
  function handlePickChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setPickValue(newValue)
  }
  function handleCityChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setCityValue(newValue)
  }
  const pickOptions: Array<SegmentedControlOption> = [
    { value: 'randomized', children: 'Randomized' },
    { value: 'sequental', children: 'Sequental' },
  ]
  const orderOptions: Array<SegmentedControlOption> = [
    { value: 'random', children: 'Random' },
    { value: 'ascending', children: 'A -> Z' },
    { value: 'descending', children: 'Z -> A' },
  ]
  let cityOptions: Array<DropdownOption> = [
    { value: '', text: 'All Cities' },
    { separator: true },
  ]
  cities.forEach(city => cityOptions.push({ value: city.name }))

  const options: PluginOptions = {
    pick: pickValue,
    order: orderValue,
    city: cityValue,
  }
  const handleAddressButtonClick = useCallback(() => {
    emit<NameHandler>('ADDRESS', options)
  }, [options])
  const handleCompleteAddressButtonClick = useCallback(() => {
    emit<NameHandler>('COMPLETE_ADDRESS', options)
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
  const handleCityCommaDistrictButtonClick = useCallback(() => {
    emit<NameHandler>('CITY_COMMA_DISTRICT', options)
  }, [options])
  const handleCityToCityButtonClick = useCallback(() => {
    emit<NameHandler>('CITY_TO_CITY', options)
  }, [options])
  const handleDistrictToDistrictButtonClick = useCallback(() => {
    emit<NameHandler>('DISTRICT_TO_DISTRICT', options)
  }, [options])
  return (
    <Container space="medium">
      <VerticalSpace space="medium" />
      <Text>
        <Bold>Pick</Bold>
      </Text>
      <VerticalSpace space="small" />
      <SegmentedControl
        onChange={handlePickChange}
        options={pickOptions}
        value={pickValue}
      />
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
      <VerticalSpace space="medium" />
      <Text>
        <Bold>City</Bold>
      </Text>
      <VerticalSpace space="small" />
      <Dropdown
        onChange={handleCityChange}
        options={cityOptions}
        value={cityValue}
        placeholder="All cities"
      />
      <VerticalSpace space="large" />
      <Button secondary fullWidth onClick={handleAddressButtonClick}>
        Address
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleCompleteAddressButtonClick}>
        Complete Address
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
      <Button secondary fullWidth onClick={handleCityCommaDistrictButtonClick}>
        City, District
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleCityToCityButtonClick}>
        City - City
      </Button>
      <VerticalSpace space="extraSmall" />
      <Button secondary fullWidth onClick={handleDistrictToDistrictButtonClick}>
        District - District
      </Button>
      <VerticalSpace space="extraSmall" />
    </Container>
  )
}

export default render(Plugin)

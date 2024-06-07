import React, { FC, useEffect, useLayoutEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { EmptyState, ListView, Screen } from "app/components"
import { TotpAccount, useStores } from "app/models"
import { ActivityIndicator } from "react-native"
import { AppStackParamList } from "app/navigators"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Item } from "react-navigation-header-buttons"
import TotpAccountCard from "app/components/TotpAccountCard"

type ScreenProps = NativeStackScreenProps<AppStackParamList, "TotpAccounts">

export const TotpAccountsScreen: FC<ScreenProps> = observer(function TotpAccountsScreen({
  navigation,
}: ScreenProps) {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Accounts",
      headerRight: () => (
        <Item
          title={"Settings"}
          iconName={"search"}
          onPress={() => navigation.navigate("Settings")}
        />
      ),
    })
  }, [navigation])

  const { totpAccountStore } = useStores()

  const [searchText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const filteredAccounts =
    searchText.length > 0
      ? totpAccountStore.accounts.filter(
          (account) =>
            account.accountName.includes(searchText) || account.issuer.includes(searchText),
        )
      : totpAccountStore.accounts

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)

      await totpAccountStore.fetchAccounts()
      setIsLoading(false)
    })()
  }, [totpAccountStore])

  return (
    <Screen
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <ListView<TotpAccount>
        contentContainerStyle={{ paddingTop: 100 }}
        data={filteredAccounts}
        estimatedItemSize={36}
        ListEmptyComponent={() => (isLoading ? <ActivityIndicator /> : <EmptyState />)}
        renderItem={({ item, index }) => <TotpAccountCard item={item} isFirst={index === 0} />}
      />
    </Screen>
  )
})

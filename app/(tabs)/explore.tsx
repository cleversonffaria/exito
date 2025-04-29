import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explorar</ThemedText>
      </ThemedView>
      <ThemedText>Este app inclui código de exemplo para ajudar você a começar.</ThemedText>
      <Collapsible title="Roteamento baseado em arquivos">
        <ThemedText>
          Este app possui duas telas:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> e{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          O arquivo de layout em <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          configura o navegador de abas.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Saiba mais</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Suporte para Android, iOS e web">
        <ThemedText>
          Você pode abrir este projeto no Android, iOS e web. Para abrir a versão web, pressione{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> no terminal que está executando este projeto.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Imagens">
        <ThemedText>
          Para imagens estáticas, você pode usar os sufixos <ThemedText type="defaultSemiBold">@2x</ThemedText> e{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> para fornecer arquivos para diferentes densidades de tela.
        </ThemedText>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Saiba mais</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Fontes personalizadas">
        <ThemedText>
          Abra <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText> para ver como carregar{' '}
          <ThemedText style={{ fontFamily: 'SpaceMono' }}>
            fontes personalizadas como esta.
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">Saiba mais</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Componentes para modo claro e escuro">
        <ThemedText>
          Este template possui suporte a modo claro e escuro. O hook{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> permite inspecionar
          qual o esquema de cores atual do usuário, assim você pode ajustar as cores da UI conforme necessário.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Saiba mais</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animações">
        <ThemedText>
          Este template inclui um exemplo de componente animado. O componente{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> utiliza a poderosa
          biblioteca <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText>{' '}
          para criar uma animação de mão acenando.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              O componente <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              fornece um efeito de paralaxe para a imagem do cabeçalho.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

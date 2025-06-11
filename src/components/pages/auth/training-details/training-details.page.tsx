import { ButtonAtom } from "@atom/button";
import { useRef } from "react";
import { ScrollView, View } from "react-native";
import Video from "react-native-video";
import { TrainingInfoItem } from "./_components/training-info-item";
import { TrainingSection } from "./_components/training-section";
import { useTrainingDetails } from "./training-details.useCase";
import { cn } from "@/utils/cn";

export default function TrainingDetailsPage() {
  const {
    getVideoSource,
    selectedTraining,
    remainingRepetitions,
    handleCompleteRepetition,
    exerciseInfoData,
    isCompleting,
    isLoading,
    isFullscreen,
    handleFullscreenEnter,
    handleFullscreenExit,
  } = useTrainingDetails();

  const videoRef = useRef<any>(null);

  if (!selectedTraining) return null;

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-6 pb-6">
          <View
            className="mb-8 rounded-2xl overflow-hidden bg-gym-black-600"
            style={{ height: 256 }}
          >
            <Video
              ref={videoRef}
              source={getVideoSource()}
              style={{ width: "100%", height: "100%" }}
              controls={true}
              resizeMode={isFullscreen ? "contain" : "cover"}
              repeat={true}
              muted={true}
              playWhenInactive={false}
              playInBackground={false}
              fullscreenAutorotate={false}
              fullscreenOrientation="portrait"
              allowsExternalPlayback={false}
              ignoreSilentSwitch="ignore"
              onFullscreenPlayerWillPresent={handleFullscreenEnter}
              onFullscreenPlayerWillDismiss={handleFullscreenExit}
            />
          </View>

          <View className="space-y-6">
            {exerciseInfoData.map((info, index) => (
              <TrainingInfoItem
                key={index}
                label={info.label}
                value={info.value}
              />
            ))}

            {selectedTraining.muscleGroups.length > 0 && (
              <TrainingSection
                title="Músculos trabalhados:"
                content={selectedTraining.muscleGroups.join(", ")}
              />
            )}

            {selectedTraining.description && (
              <TrainingSection
                title="Descrição do exercício:"
                content={selectedTraining.description}
                className="text-base leading-6"
              />
            )}

            {selectedTraining.observations && (
              <TrainingSection
                title="Observações:"
                content={selectedTraining.observations}
                className="text-base leading-6"
              />
            )}
          </View>
        </View>
      </ScrollView>

      <View className="px-6 pb-8 pt-4 bg-gym-black-700">
        <ButtonAtom.Root
          onPress={handleCompleteRepetition}
          disabled={isCompleting || remainingRepetitions === 0 || isLoading}
          className={cn(
            "bg-gym-primary-500",
            (isCompleting || remainingRepetitions === 0 || isLoading) &&
              "opacity-50"
          )}
        >
          <ButtonAtom.Text>
            {isLoading
              ? "Carregando..."
              : isCompleting
              ? "Concluindo..."
              : remainingRepetitions === 0
              ? "Exercício Concluído"
              : `Concluir Repetição (${remainingRepetitions})`}
          </ButtonAtom.Text>
        </ButtonAtom.Root>
      </View>
    </View>
  );
}

import { ButtonAtom } from "@atom/button";
import { useRef } from "react";
import { ScrollView, View } from "react-native";
import Video from "react-native-video";
import { ExerciseInfoItem } from "./_components/exercise-info-item";
import { ExerciseSection } from "./_components/exercise-section";
import { useExerciseDetails } from "./exercise-details.useCase";

export default function ExerciseDetailsPage() {
  const {
    getVideoSource,
    selectedExercise,
    remainingRepetitions,
    handleCompleteRepetition,
    exerciseInfoData,
    isFullscreen,
    handleFullscreenEnter,
    handleFullscreenExit,
  } = useExerciseDetails();

  const videoRef = useRef<any>(null);

  if (!selectedExercise) return null;

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
              <ExerciseInfoItem
                key={index}
                label={info.label}
                value={info.value}
              />
            ))}

            <ExerciseSection
              title="Músculos trabalhados:"
              content={selectedExercise.muscleGroups.join(", ")}
            />

            <ExerciseSection
              title="Descrição do exercício:"
              content={selectedExercise.description}
              className="text-base leading-6"
            />

            <ExerciseSection
              title="Observações:"
              content={selectedExercise.observations}
              className="text-base leading-6"
            />
          </View>
        </View>
      </ScrollView>

      <View className="px-6 pb-8 pt-4 bg-gym-black-700">
        <ButtonAtom.Root
          onPress={handleCompleteRepetition}
          className="bg-gym-primary-500"
        >
          <ButtonAtom.Text>
            Concluir Repetição ({remainingRepetitions})
          </ButtonAtom.Text>
        </ButtonAtom.Root>
      </View>
    </View>
  );
}

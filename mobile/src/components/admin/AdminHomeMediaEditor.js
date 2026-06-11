import React, { useState } from "react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import PremiumButton from "../ui/PremiumButton";
import PremiumChip from "../ui/PremiumChip";
import PremiumInput from "../ui/PremiumInput";
import AdminToggleRow from "./AdminToggleRow";
import { useTheme } from "../../context/ThemeContext";
import { uploadAdminMarketingVideo, uploadAdminProductImage } from "../../services/adminService";
import { fonts, radius, spacing, typography } from "../../theme/tokens";
import { newCommunityPostId, newCompareRowId, newHeroSlideId, newProcessStepId } from "../../utils/homeViewMedia";

function SlidePreview({ slide, styles }) {
  if (!slide?.url) {
    return (
      <View style={styles.previewEmpty}>
        <Ionicons name={slide?.mediaType === "video" ? "videocam-outline" : "image-outline"} size={28} color="#9a8b7c" />
      </View>
    );
  }
  if (slide.mediaType === "video") {
    return (
      <View style={styles.previewEmpty}>
        <Ionicons name="play-circle" size={34} color="#c9a227" />
        <Text style={styles.previewVideoLabel}>Video uploaded</Text>
      </View>
    );
  }
  return <Image source={{ uri: slide.url }} style={styles.previewImage} contentFit="cover" />;
}

function PostPreview({ post, styles }) {
  if (!post?.imageUrl) {
    return (
      <View style={styles.previewEmpty}>
        <Ionicons name="image-outline" size={28} color="#9a8b7c" />
      </View>
    );
  }
  return <Image source={{ uri: post.imageUrl }} style={styles.previewImage} contentFit="cover" />;
}

export default function AdminHomeMediaEditor({
  token,
  heroSlides,
  onHeroSlidesChange,
  aboutSection,
  onAboutSectionChange,
  communitySection,
  onCommunitySectionChange,
  compareSection,
  onCompareSectionChange,
  processSection,
  onProcessSectionChange,
  onError,
}) {
  const { colors: c } = useTheme();
  const styles = createStyles(c);
  const [uploadingKey, setUploadingKey] = useState("");

  const pickImage = async (onUrl) => {
    if (Platform.OS !== "web") {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        onError?.("Media library permission is required.");
        return;
      }
    }
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.55,
      base64: true,
    });
    if (picked.canceled) return;
    const asset = picked.assets?.[0];
    if (!asset?.base64) {
      onError?.("Could not read image.");
      return;
    }
    const uploaded = await uploadAdminProductImage(token, {
      imageBase64: asset.base64,
      mimeType: asset.mimeType || "image/jpeg",
    });
    onUrl(uploaded.url);
  };

  const pickVideo = async (onUrl) => {
    if (Platform.OS !== "web") {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        onError?.("Media library permission is required.");
        return;
      }
    }
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      base64: true,
    });
    if (picked.canceled) return;
    const asset = picked.assets?.[0];
    if (!asset?.base64) {
      onError?.("Could not read video. Try a shorter clip.");
      return;
    }
    const uploaded = await uploadAdminMarketingVideo(token, {
      videoBase64: asset.base64,
      mimeType: asset.mimeType || "video/mp4",
    });
    onUrl(uploaded.url);
  };

  const updateSlide = (id, patch) => {
    onHeroSlidesChange(
      heroSlides.map((slide) => (slide.id === id ? { ...slide, ...patch } : slide))
    );
  };

  const removeSlide = (id) => {
    onHeroSlidesChange(heroSlides.filter((slide) => slide.id !== id));
  };

  const moveSlide = (id, direction) => {
    const idx = heroSlides.findIndex((slide) => slide.id === id);
    if (idx < 0) return;
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= heroSlides.length) return;
    const next = [...heroSlides];
    const [item] = next.splice(idx, 1);
    next.splice(nextIdx, 0, item);
    onHeroSlidesChange(next.map((slide, order) => ({ ...slide, order })));
  };

  const addSlide = () => {
    onHeroSlidesChange([
      ...heroSlides,
      {
        id: newHeroSlideId(),
        order: heroSlides.length,
        mediaType: "image",
        url: "",
        title: "",
        subtitle: "",
        enabled: true,
      },
    ]);
  };

  const uploadForSlide = async (slide, mediaType) => {
    try {
      setUploadingKey(slide.id);
      onError?.("");
      if (mediaType === "video") {
        await pickVideo((url) => updateSlide(slide.id, { url, mediaType: "video" }));
      } else {
        await pickImage((url) => updateSlide(slide.id, { url, mediaType: "image" }));
      }
    } catch (err) {
      onError?.(err.message || "Upload failed.");
    } finally {
      setUploadingKey("");
    }
  };

  const addAboutPhoto = async () => {
    try {
      setUploadingKey("about-photo");
      onError?.("");
      await pickImage((url) => {
        onAboutSectionChange({
          ...aboutSection,
          photos: [...(aboutSection.photos || []), { url, caption: "" }],
        });
      });
    } catch (err) {
      onError?.(err.message || "Upload failed.");
    } finally {
      setUploadingKey("");
    }
  };

  const updateCommunity = (patch) => {
    onCommunitySectionChange({ ...communitySection, ...patch });
  };

  const updateCommunityPost = (id, patch) => {
    onCommunitySectionChange({
      ...communitySection,
      posts: (communitySection.posts || []).map((post) =>
        post.id === id ? { ...post, ...patch } : post
      ),
    });
  };

  const removeCommunityPost = (id) => {
    onCommunitySectionChange({
      ...communitySection,
      posts: (communitySection.posts || []).filter((post) => post.id !== id),
    });
  };

  const moveCommunityPost = (id, direction) => {
    const posts = [...(communitySection.posts || [])];
    const idx = posts.findIndex((post) => post.id === id);
    if (idx < 0) return;
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= posts.length) return;
    const [item] = posts.splice(idx, 1);
    posts.splice(nextIdx, 0, item);
    onCommunitySectionChange({
      ...communitySection,
      posts: posts.map((post, order) => ({ ...post, order })),
    });
  };

  const addCommunityPost = (type = "reel") => {
    const isCustomer = type === "customer";
    onCommunitySectionChange({
      ...communitySection,
      posts: [
        ...(communitySection.posts || []),
        {
          id: newCommunityPostId(),
          order: (communitySection.posts || []).length,
          enabled: true,
          type,
          tag: isCustomer ? "Customer" : "Reel",
          imageUrl: "",
          views: "",
          likes: "",
          quote: "",
          author: isCustomer
            ? { name: "", subtitle: "", avatar: "", brand: false }
            : { name: "kankreg_ghee", subtitle: "", avatar: "K", brand: true },
        },
      ],
    });
  };

  const uploadCommunityPostImage = async (post) => {
    try {
      setUploadingKey(post.id);
      onError?.("");
      await pickImage((url) => updateCommunityPost(post.id, { imageUrl: url }));
    } catch (err) {
      onError?.(err.message || "Upload failed.");
    } finally {
      setUploadingKey("");
    }
  };

  const updateCompare = (patch) => {
    onCompareSectionChange({ ...compareSection, ...patch });
  };

  const updateCompareRow = (id, patch) => {
    onCompareSectionChange({
      ...compareSection,
      rows: (compareSection.rows || []).map((row) => (row.id === id ? { ...row, ...patch } : row)),
    });
  };

  const removeCompareRow = (id) => {
    onCompareSectionChange({
      ...compareSection,
      rows: (compareSection.rows || []).filter((row) => row.id !== id),
    });
  };

  const moveCompareRow = (id, direction) => {
    const rows = [...(compareSection.rows || [])];
    const idx = rows.findIndex((row) => row.id === id);
    if (idx < 0) return;
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= rows.length) return;
    const [item] = rows.splice(idx, 1);
    rows.splice(nextIdx, 0, item);
    onCompareSectionChange({
      ...compareSection,
      rows: rows.map((row, order) => ({ ...row, order })),
    });
  };

  const addCompareRow = () => {
    onCompareSectionChange({
      ...compareSection,
      rows: [
        ...(compareSection.rows || []),
        {
          id: newCompareRowId(),
          order: (compareSection.rows || []).length,
          enabled: true,
          label: "",
          ours: "",
          ordinary: "",
          oursImageUrl: "",
          ordinaryImageUrl: "",
        },
      ],
    });
  };

  const uploadCompareImage = async (row, field) => {
    try {
      setUploadingKey(`${row.id}-${field}`);
      onError?.("");
      await pickImage((url) => updateCompareRow(row.id, { [field]: url }));
    } catch (err) {
      onError?.(err.message || "Upload failed.");
    } finally {
      setUploadingKey("");
    }
  };

  const updateProcess = (patch) => {
    onProcessSectionChange({ ...processSection, ...patch });
  };

  const updateProcessStep = (id, patch) => {
    onProcessSectionChange({
      ...processSection,
      steps: (processSection.steps || []).map((step) => (step.id === id ? { ...step, ...patch } : step)),
    });
  };

  const removeProcessStep = (id) => {
    onProcessSectionChange({
      ...processSection,
      steps: (processSection.steps || []).filter((step) => step.id !== id),
    });
  };

  const moveProcessStep = (id, direction) => {
    const steps = [...(processSection.steps || [])];
    const idx = steps.findIndex((step) => step.id === id);
    if (idx < 0) return;
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= steps.length) return;
    const [item] = steps.splice(idx, 1);
    steps.splice(nextIdx, 0, item);
    onProcessSectionChange({
      ...processSection,
      steps: steps.map((step, order) => ({ ...step, order })),
    });
  };

  const addProcessStep = () => {
    onProcessSectionChange({
      ...processSection,
      steps: [
        ...(processSection.steps || []),
        {
          id: newProcessStepId(),
          order: (processSection.steps || []).length,
          enabled: true,
          title: "",
          description: "",
          imageUrl: "",
          imageFit: "cover",
          imagePosition: "top center",
        },
      ],
    });
  };

  const uploadProcessStepImage = async (step) => {
    try {
      setUploadingKey(`process-${step.id}`);
      onError?.("");
      await pickImage((url) => updateProcessStep(step.id, { imageUrl: url }));
    } catch (err) {
      onError?.(err.message || "Upload failed.");
    } finally {
      setUploadingKey("");
    }
  };

  const uploadAboutVideo = async () => {
    try {
      setUploadingKey("about-video");
      onError?.("");
      await pickVideo((url) => onAboutSectionChange({ ...aboutSection, videoUrl: url }));
    } catch (err) {
      onError?.(err.message || "Upload failed.");
    } finally {
      setUploadingKey("");
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.blockTitle}>Hero slider (web)</Text>
      <Text style={styles.blockHint}>Images or short videos shown in the home hero carousel.</Text>

      {heroSlides.map((slide, index) => (
        <View key={slide.id} style={[styles.card, { borderColor: c.border }]}>
          <View style={styles.cardTop}>
            <SlidePreview slide={slide} styles={styles} />
            <View style={styles.cardMeta}>
              <Text style={[styles.cardLabel, { color: c.textPrimary }]}>Slide {index + 1}</Text>
              <View style={styles.row}>
                <PremiumButton
                  label="Photo"
                  size="sm"
                  variant="secondary"
                  iconLeft="image-outline"
                  loading={uploadingKey === slide.id}
                  disabled={Boolean(uploadingKey)}
                  onPress={() => uploadForSlide(slide, "image")}
                />
                <PremiumButton
                  label="Video"
                  size="sm"
                  variant="secondary"
                  iconLeft="videocam-outline"
                  loading={uploadingKey === slide.id}
                  disabled={Boolean(uploadingKey)}
                  onPress={() => uploadForSlide(slide, "video")}
                />
              </View>
              <View style={styles.row}>
                <Pressable onPress={() => moveSlide(slide.id, -1)} style={styles.iconBtn}>
                  <Ionicons name="arrow-up" size={18} color={c.textSecondary} />
                </Pressable>
                <Pressable onPress={() => moveSlide(slide.id, 1)} style={styles.iconBtn}>
                  <Ionicons name="arrow-down" size={18} color={c.textSecondary} />
                </Pressable>
                <Pressable onPress={() => removeSlide(slide.id)} style={styles.iconBtn}>
                  <Ionicons name="trash-outline" size={18} color="#b45309" />
                </Pressable>
              </View>
            </View>
          </View>
          <PremiumInput
            label="Slide title"
            value={slide.title}
            onChangeText={(value) => updateSlide(slide.id, { title: value })}
          />
          <PremiumInput
            label="Slide subtitle"
            value={slide.subtitle}
            onChangeText={(value) => updateSlide(slide.id, { subtitle: value })}
          />
          <AdminToggleRow
            title="Show on website"
            subtitle="Disabled slides are hidden from the hero carousel"
            value={slide.enabled !== false}
            onValueChange={(enabled) => updateSlide(slide.id, { enabled })}
            isLast
          />
        </View>
      ))}

      <PremiumButton label="Add hero slide" variant="outline" iconLeft="add" onPress={addSlide} />

      <Text style={[styles.blockTitle, styles.blockTitleSpaced]}>About KankreG (home + about page)</Text>
      <Text style={styles.blockHint}>
        Story + video on home. About page uses text, photos, and story blocks below (no video).
      </Text>

      <AdminToggleRow
        title="Show about section"
        subtitle="Appears after the product grid on web home"
        value={aboutSection.enabled !== false}
        onValueChange={(enabled) => onAboutSectionChange({ ...aboutSection, enabled })}
      />

      <PremiumInput
        label="Eyebrow"
        value={aboutSection.eyebrow || ""}
        onChangeText={(eyebrow) => onAboutSectionChange({ ...aboutSection, eyebrow })}
      />
      <PremiumInput
        label="Title"
        value={aboutSection.title || ""}
        onChangeText={(title) => onAboutSectionChange({ ...aboutSection, title })}
      />
      <PremiumInput
        label="Body"
        value={aboutSection.body || ""}
        onChangeText={(body) => onAboutSectionChange({ ...aboutSection, body })}
        multiline
        numberOfLines={4}
      />

      <View style={styles.row}>
        <PremiumButton
          label={aboutSection.videoUrl ? "Replace video" : "Upload video"}
          variant="secondary"
          iconLeft="videocam-outline"
          loading={uploadingKey === "about-video"}
          disabled={Boolean(uploadingKey)}
          onPress={uploadAboutVideo}
        />
        {aboutSection.videoUrl ? (
          <PremiumButton
            label="Remove video"
            variant="ghost"
            onPress={() => onAboutSectionChange({ ...aboutSection, videoUrl: "", videoCaption: "" })}
          />
        ) : null}
      </View>
      <PremiumInput
        label="Video caption"
        value={aboutSection.videoCaption || ""}
        onChangeText={(videoCaption) => onAboutSectionChange({ ...aboutSection, videoCaption })}
      />

      <Text style={[styles.cardLabel, { color: c.textPrimary, marginTop: spacing.sm }]}>Photo gallery</Text>
      {(aboutSection.photos || []).map((photo, idx) => (
        <View key={`${photo.url}-${idx}`} style={[styles.photoRow, { borderColor: c.border }]}>
          <Image source={{ uri: photo.url }} style={styles.photoThumb} contentFit="cover" />
          <View style={styles.photoFields}>
            <PremiumInput
              label="Caption"
              value={photo.caption || ""}
              onChangeText={(caption) => {
                const photos = [...aboutSection.photos];
                photos[idx] = { ...photos[idx], caption };
                onAboutSectionChange({ ...aboutSection, photos });
              }}
            />
            <PremiumButton
              label="Remove"
              size="sm"
              variant="ghost"
              onPress={() => {
                const photos = aboutSection.photos.filter((_, i) => i !== idx);
                onAboutSectionChange({ ...aboutSection, photos });
              }}
            />
          </View>
        </View>
      ))}
      <PremiumButton
        label="Add photo"
        variant="outline"
        iconLeft="image-outline"
        loading={uploadingKey === "about-photo"}
        disabled={Boolean(uploadingKey)}
        onPress={addAboutPhoto}
      />

      <Text style={[styles.cardLabel, { color: c.textPrimary, marginTop: spacing.md }]}>About page extras</Text>
      <PremiumInput
        label="Page lead (subtitle under title)"
        value={aboutSection.pageLead || ""}
        onChangeText={(pageLead) => onAboutSectionChange({ ...aboutSection, pageLead })}
        multiline
      />
      <PremiumInput
        label="Pull quote"
        value={aboutSection.pullQuote || ""}
        onChangeText={(pullQuote) => onAboutSectionChange({ ...aboutSection, pullQuote })}
        multiline
        numberOfLines={3}
      />
      <PremiumInput
        label="Body continued"
        value={aboutSection.bodyContinued || ""}
        onChangeText={(bodyContinued) => onAboutSectionChange({ ...aboutSection, bodyContinued })}
        multiline
        numberOfLines={4}
      />

      <Text style={[styles.cardLabel, { color: c.textPrimary, marginTop: spacing.md }]}>Heritage (Kankrej breed)</Text>
      <PremiumInput
        label="Eyebrow"
        value={aboutSection.heritage?.eyebrow || ""}
        onChangeText={(eyebrow) =>
          onAboutSectionChange({ ...aboutSection, heritage: { ...aboutSection.heritage, eyebrow } })
        }
      />
      <PremiumInput
        label="Title"
        value={aboutSection.heritage?.title || ""}
        onChangeText={(title) =>
          onAboutSectionChange({ ...aboutSection, heritage: { ...aboutSection.heritage, title } })
        }
      />
      <PremiumInput
        label="Body"
        value={aboutSection.heritage?.body || ""}
        onChangeText={(body) =>
          onAboutSectionChange({ ...aboutSection, heritage: { ...aboutSection.heritage, body } })
        }
        multiline
        numberOfLines={4}
      />

      <Text style={[styles.cardLabel, { color: c.textPrimary, marginTop: spacing.sm }]}>Bilona craft</Text>
      <PremiumInput
        label="Eyebrow"
        value={aboutSection.bilona?.eyebrow || ""}
        onChangeText={(eyebrow) =>
          onAboutSectionChange({ ...aboutSection, bilona: { ...aboutSection.bilona, eyebrow } })
        }
      />
      <PremiumInput
        label="Title"
        value={aboutSection.bilona?.title || ""}
        onChangeText={(title) =>
          onAboutSectionChange({ ...aboutSection, bilona: { ...aboutSection.bilona, title } })
        }
      />
      <PremiumInput
        label="Body"
        value={aboutSection.bilona?.body || ""}
        onChangeText={(body) =>
          onAboutSectionChange({ ...aboutSection, bilona: { ...aboutSection.bilona, body } })
        }
        multiline
        numberOfLines={4}
      />

      <Text style={[styles.cardLabel, { color: c.textPrimary, marginTop: spacing.sm }]}>Origin story</Text>
      <PremiumInput
        label="Eyebrow"
        value={aboutSection.origin?.eyebrow || ""}
        onChangeText={(eyebrow) =>
          onAboutSectionChange({ ...aboutSection, origin: { ...aboutSection.origin, eyebrow } })
        }
      />
      <PremiumInput
        label="Title"
        value={aboutSection.origin?.title || ""}
        onChangeText={(title) =>
          onAboutSectionChange({ ...aboutSection, origin: { ...aboutSection.origin, title } })
        }
      />
      <PremiumInput
        label="Body"
        value={aboutSection.origin?.body || ""}
        onChangeText={(body) =>
          onAboutSectionChange({ ...aboutSection, origin: { ...aboutSection.origin, body } })
        }
        multiline
        numberOfLines={4}
      />

      <Text style={[styles.cardLabel, { color: c.textPrimary, marginTop: spacing.sm }]}>Values</Text>
      {(aboutSection.values || []).map((item, idx) => (
        <View key={`value-${idx}`} style={[styles.photoRow, { borderColor: c.border }]}>
          <View style={styles.photoFields}>
            <PremiumInput
              label={`Value ${idx + 1} title`}
              value={item.title || ""}
              onChangeText={(title) => {
                const values = [...(aboutSection.values || [])];
                values[idx] = { ...values[idx], title };
                onAboutSectionChange({ ...aboutSection, values });
              }}
            />
            <PremiumInput
              label="Description"
              value={item.body || ""}
              onChangeText={(body) => {
                const values = [...(aboutSection.values || [])];
                values[idx] = { ...values[idx], body };
                onAboutSectionChange({ ...aboutSection, values });
              }}
              multiline
            />
          </View>
        </View>
      ))}

      <Text style={[styles.cardLabel, { color: c.textPrimary, marginTop: spacing.sm }]}>Sidebar stats</Text>
      {(aboutSection.sidebarStats || []).map((stat, idx) => (
        <View key={`stat-${idx}`} style={[styles.photoRow, { borderColor: c.border }]}>
          <View style={styles.photoFields}>
            <PremiumInput
              label={`Stat ${idx + 1} value`}
              value={stat.value || ""}
              onChangeText={(value) => {
                const sidebarStats = [...(aboutSection.sidebarStats || [])];
                sidebarStats[idx] = { ...sidebarStats[idx], value };
                onAboutSectionChange({ ...aboutSection, sidebarStats });
              }}
            />
            <PremiumInput
              label="Label"
              value={stat.label || ""}
              onChangeText={(label) => {
                const sidebarStats = [...(aboutSection.sidebarStats || [])];
                sidebarStats[idx] = { ...sidebarStats[idx], label };
                onAboutSectionChange({ ...aboutSection, sidebarStats });
              }}
            />
          </View>
        </View>
      ))}

      <Text style={[styles.cardLabel, { color: c.textPrimary, marginTop: spacing.sm }]}>Highlights (promise)</Text>
      {(aboutSection.highlights || []).map((item, idx) => (
        <View key={`hl-${idx}`} style={[styles.photoRow, { borderColor: c.border }]}>
          <View style={styles.photoFields}>
            <PremiumInput
              label={`Highlight ${idx + 1}`}
              value={item.value || ""}
              onChangeText={(value) => {
                const highlights = [...(aboutSection.highlights || [])];
                highlights[idx] = { ...highlights[idx], value };
                onAboutSectionChange({ ...aboutSection, highlights });
              }}
            />
            <PremiumInput
              label="Label"
              value={item.label || ""}
              onChangeText={(label) => {
                const highlights = [...(aboutSection.highlights || [])];
                highlights[idx] = { ...highlights[idx], label };
                onAboutSectionChange({ ...aboutSection, highlights });
              }}
            />
            <PremiumInput
              label="Description"
              value={item.description || ""}
              onChangeText={(description) => {
                const highlights = [...(aboutSection.highlights || [])];
                highlights[idx] = { ...highlights[idx], description };
                onAboutSectionChange({ ...aboutSection, highlights });
              }}
              multiline
            />
          </View>
        </View>
      ))}

      <PremiumInput
        label="Mission eyebrow"
        value={aboutSection.mission?.eyebrow || ""}
        onChangeText={(eyebrow) =>
          onAboutSectionChange({ ...aboutSection, mission: { ...aboutSection.mission, eyebrow } })
        }
      />
      <PremiumInput
        label="Mission title"
        value={aboutSection.mission?.title || ""}
        onChangeText={(title) =>
          onAboutSectionChange({ ...aboutSection, mission: { ...aboutSection.mission, title } })
        }
      />
      {(aboutSection.mission?.paragraphs || ["", ""]).map((para, idx) => (
        <PremiumInput
          key={`mission-p-${idx}`}
          label={`Mission paragraph ${idx + 1}`}
          value={para || ""}
          onChangeText={(text) => {
            const paragraphs = [...(aboutSection.mission?.paragraphs || ["", ""])];
            paragraphs[idx] = text;
            onAboutSectionChange({ ...aboutSection, mission: { ...aboutSection.mission, paragraphs } });
          }}
          multiline
          numberOfLines={3}
        />
      ))}

      <Text style={[styles.cardLabel, { color: c.textPrimary, marginTop: spacing.sm }]}>Craft timeline</Text>
      <PremiumInput
        label="Craft eyebrow"
        value={aboutSection.craft?.eyebrow || ""}
        onChangeText={(eyebrow) =>
          onAboutSectionChange({ ...aboutSection, craft: { ...aboutSection.craft, eyebrow } })
        }
      />
      <PremiumInput
        label="Craft title"
        value={aboutSection.craft?.title || ""}
        onChangeText={(title) =>
          onAboutSectionChange({ ...aboutSection, craft: { ...aboutSection.craft, title } })
        }
      />
      {(aboutSection.craft?.steps || []).map((step, idx) => (
        <View key={step.id || `craft-${idx}`} style={[styles.photoRow, { borderColor: c.border }]}>
          <View style={styles.photoFields}>
            <PremiumInput
              label={`Step ${idx + 1} number`}
              value={step.label || ""}
              onChangeText={(label) => {
                const steps = [...(aboutSection.craft?.steps || [])];
                steps[idx] = { ...steps[idx], label };
                onAboutSectionChange({ ...aboutSection, craft: { ...aboutSection.craft, steps } });
              }}
            />
            <PremiumInput
              label="Title"
              value={step.title || ""}
              onChangeText={(title) => {
                const steps = [...(aboutSection.craft?.steps || [])];
                steps[idx] = { ...steps[idx], title };
                onAboutSectionChange({ ...aboutSection, craft: { ...aboutSection.craft, steps } });
              }}
            />
            <PremiumInput
              label="Body"
              value={step.body || ""}
              onChangeText={(body) => {
                const steps = [...(aboutSection.craft?.steps || [])];
                steps[idx] = { ...steps[idx], body };
                onAboutSectionChange({ ...aboutSection, craft: { ...aboutSection.craft, steps } });
              }}
              multiline
            />
          </View>
        </View>
      ))}

      <Text style={[styles.cardLabel, { color: c.textPrimary, marginTop: spacing.sm }]}>CTA band</Text>
      <PremiumInput
        label="CTA title"
        value={aboutSection.ctaBand?.title || ""}
        onChangeText={(title) =>
          onAboutSectionChange({ ...aboutSection, ctaBand: { ...aboutSection.ctaBand, title } })
        }
      />
      <PremiumInput
        label="CTA body"
        value={aboutSection.ctaBand?.body || ""}
        onChangeText={(body) =>
          onAboutSectionChange({ ...aboutSection, ctaBand: { ...aboutSection.ctaBand, body } })
        }
        multiline
      />
      <PremiumInput
        label="Primary button"
        value={aboutSection.ctaBand?.ctaLabel || ""}
        onChangeText={(ctaLabel) =>
          onAboutSectionChange({ ...aboutSection, ctaBand: { ...aboutSection.ctaBand, ctaLabel } })
        }
      />
      <PremiumInput
        label="Secondary button"
        value={aboutSection.ctaBand?.ctaSecondaryLabel || ""}
        onChangeText={(ctaSecondaryLabel) =>
          onAboutSectionChange({ ...aboutSection, ctaBand: { ...aboutSection.ctaBand, ctaSecondaryLabel } })
        }
      />

      <Text style={[styles.blockTitle, styles.blockTitleSpaced]}>Community / Instagram (web)</Text>
      <Text style={styles.blockHint}>
        “Loved by families, shared every day” rail after the Our Story video — reels and customer posts.
      </Text>

      <AdminToggleRow
        title="Show community section"
        subtitle="Horizontal Instagram-style cards on web home"
        value={communitySection.enabled !== false}
        onValueChange={(enabled) => updateCommunity({ enabled })}
      />

      <PremiumInput
        label="Eyebrow"
        value={communitySection.eyebrow || ""}
        onChangeText={(eyebrow) => updateCommunity({ eyebrow })}
      />
      <PremiumInput
        label="Section title"
        value={communitySection.title || ""}
        onChangeText={(title) => updateCommunity({ title })}
      />
      <PremiumInput
        label="Subtitle"
        value={communitySection.subtitle || ""}
        onChangeText={(subtitle) => updateCommunity({ subtitle })}
      />

      <Text style={[styles.cardLabel, { color: c.textPrimary, marginTop: spacing.xs }]}>Instagram</Text>
      <PremiumInput
        label="Handle (no @)"
        value={communitySection.instagram?.handle || ""}
        onChangeText={(handle) =>
          updateCommunity({
            instagram: { ...communitySection.instagram, handle },
          })
        }
      />
      <PremiumInput
        label="Display handle"
        value={communitySection.instagram?.displayHandle || ""}
        onChangeText={(displayHandle) =>
          updateCommunity({
            instagram: { ...communitySection.instagram, displayHandle },
          })
        }
      />
      <PremiumInput
        label="Followers label"
        value={communitySection.instagram?.followersLabel || ""}
        onChangeText={(followersLabel) =>
          updateCommunity({
            instagram: { ...communitySection.instagram, followersLabel },
          })
        }
      />
      <PremiumInput
        label="Follow button label"
        value={communitySection.instagram?.followLabel || ""}
        onChangeText={(followLabel) =>
          updateCommunity({
            instagram: { ...communitySection.instagram, followLabel },
          })
        }
      />
      <PremiumInput
        label="Instagram URL"
        value={communitySection.instagram?.url || ""}
        onChangeText={(url) =>
          updateCommunity({
            instagram: { ...communitySection.instagram, url },
          })
        }
      />

      {(communitySection.posts || []).map((post, index) => (
        <View key={post.id} style={[styles.card, { borderColor: c.border }]}>
          <View style={styles.cardTop}>
            <PostPreview post={post} styles={styles} />
            <View style={styles.cardMeta}>
              <Text style={[styles.cardLabel, { color: c.textPrimary }]}>Post {index + 1}</Text>
              <View style={styles.row}>
                <PremiumButton
                  label="Upload image"
                  size="sm"
                  variant="secondary"
                  iconLeft="image-outline"
                  loading={uploadingKey === post.id}
                  disabled={Boolean(uploadingKey)}
                  onPress={() => uploadCommunityPostImage(post)}
                />
                {post.imageUrl ? (
                  <PremiumButton
                    label="Clear"
                    size="sm"
                    variant="ghost"
                    onPress={() => updateCommunityPost(post.id, { imageUrl: "" })}
                  />
                ) : null}
              </View>
              <View style={styles.row}>
                <Pressable onPress={() => moveCommunityPost(post.id, -1)} style={styles.iconBtn}>
                  <Ionicons name="arrow-up" size={18} color={c.textSecondary} />
                </Pressable>
                <Pressable onPress={() => moveCommunityPost(post.id, 1)} style={styles.iconBtn}>
                  <Ionicons name="arrow-down" size={18} color={c.textSecondary} />
                </Pressable>
                <Pressable onPress={() => removeCommunityPost(post.id)} style={styles.iconBtn}>
                  <Ionicons name="trash-outline" size={18} color="#b45309" />
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <PremiumChip
              label="Reel"
              selected={post.type !== "customer"}
              onPress={() =>
                updateCommunityPost(post.id, {
                  type: "reel",
                  tag: post.tag === "Customer" ? "Reel" : post.tag || "Reel",
                  author: { ...post.author, brand: true, name: post.author?.name || "kankreg_ghee" },
                })
              }
            />
            <PremiumChip
              label="Customer"
              selected={post.type === "customer"}
              onPress={() =>
                updateCommunityPost(post.id, {
                  type: "customer",
                  tag: "Customer",
                  author: { ...post.author, brand: false },
                })
              }
            />
          </View>

          <PremiumInput
            label="Tag label"
            value={post.tag || ""}
            onChangeText={(tag) => updateCommunityPost(post.id, { tag })}
            placeholder="Reel, Recipe, Customer…"
          />

          {post.type === "customer" ? (
            <PremiumInput
              label="Customer quote"
              value={post.quote || ""}
              onChangeText={(quote) => updateCommunityPost(post.id, { quote })}
              multiline
              numberOfLines={3}
            />
          ) : (
            <PremiumInput
              label="View count"
              value={post.views || ""}
              onChangeText={(views) => updateCommunityPost(post.id, { views })}
              placeholder="e.g. 12.3k"
            />
          )}

          <PremiumInput
            label="Like count"
            value={post.likes || ""}
            onChangeText={(likes) => updateCommunityPost(post.id, { likes })}
            placeholder="e.g. 1.2k"
          />
          <PremiumInput
            label="Author name"
            value={post.author?.name || ""}
            onChangeText={(name) =>
              updateCommunityPost(post.id, {
                author: { ...post.author, name },
              })
            }
          />
          <PremiumInput
            label="Author subtitle"
            value={post.author?.subtitle || ""}
            onChangeText={(subtitle) =>
              updateCommunityPost(post.id, {
                author: { ...post.author, subtitle },
              })
            }
            placeholder="Location or reel title"
          />
          <PremiumInput
            label="Avatar letter"
            value={post.author?.avatar || ""}
            onChangeText={(avatar) =>
              updateCommunityPost(post.id, {
                author: { ...post.author, avatar: avatar.slice(0, 2) },
              })
            }
            placeholder="K"
          />
          <AdminToggleRow
            title="Brand account"
            subtitle="Gold avatar for @kankreg_ghee posts"
            value={post.author?.brand !== false}
            onValueChange={(brand) =>
              updateCommunityPost(post.id, {
                author: { ...post.author, brand },
              })
            }
            isLast
          />
          <AdminToggleRow
            title="Show on website"
            subtitle="Disabled posts are hidden from the community rail"
            value={post.enabled !== false}
            onValueChange={(enabled) => updateCommunityPost(post.id, { enabled })}
            isLast
          />
        </View>
      ))}

      <View style={styles.row}>
        <PremiumButton label="Add reel post" variant="outline" iconLeft="add" onPress={() => addCommunityPost("reel")} />
        <PremiumButton
          label="Add customer post"
          variant="outline"
          iconLeft="add"
          onPress={() => addCommunityPost("customer")}
        />
      </View>

      <Text style={[styles.blockTitle, styles.blockTitleSpaced]}>Process journey (web + native)</Text>
      <Text style={styles.blockHint}>
        “Six steps from pasture to jar” — cinematic timeline on web, card rail on native.
      </Text>

      <AdminToggleRow
        title="Show process section"
        subtitle="Bilona journey block after the timeline video"
        value={processSection.enabled !== false}
        onValueChange={(enabled) => updateProcess({ enabled })}
      />

      <PremiumInput
        label="Eyebrow"
        value={processSection.eyebrow || ""}
        onChangeText={(eyebrow) => updateProcess({ eyebrow })}
      />
      <PremiumInput
        label="Section title"
        value={processSection.title || ""}
        onChangeText={(title) => updateProcess({ title })}
      />
      <PremiumInput
        label="Subtitle"
        value={processSection.subtitle || ""}
        onChangeText={(subtitle) => updateProcess({ subtitle })}
        multiline
        numberOfLines={2}
      />
      <PremiumInput
        label="Journey label"
        value={processSection.journeyLabel || ""}
        onChangeText={(journeyLabel) => updateProcess({ journeyLabel })}
        placeholder="The Bilona journey"
      />
      <PremiumInput
        label="Film label"
        value={processSection.filmLabel || ""}
        onChangeText={(filmLabel) => updateProcess({ filmLabel })}
        placeholder="Chapter I"
      />
      <PremiumInput
        label="Opening line"
        value={processSection.openingLine || ""}
        onChangeText={(openingLine) => updateProcess({ openingLine })}
        multiline
        numberOfLines={2}
      />

      {(processSection.steps || []).map((step, index) => (
        <View key={step.id} style={[styles.card, { borderColor: c.border }]}>
          <View style={styles.cardTop}>
            {step.imageUrl ? (
              <Image source={{ uri: step.imageUrl }} style={styles.compareThumb} contentFit="cover" />
            ) : (
              <View style={styles.compareThumbEmpty}>
                <Text style={styles.compareThumbLabel}>Step</Text>
              </View>
            )}
            <View style={styles.cardMeta}>
              <Text style={[styles.cardLabel, { color: c.textPrimary }]}>Step {index + 1}</Text>
              <PremiumChip
                label={step.enabled !== false ? "Visible" : "Hidden"}
                tone={step.enabled !== false ? "success" : "muted"}
                compact
              />
            </View>
            <View style={styles.cardActions}>
              <Pressable onPress={() => moveProcessStep(step.id, -1)} disabled={index === 0}>
                <Ionicons name="chevron-up" size={20} color={index === 0 ? c.textMuted : c.textPrimary} />
              </Pressable>
              <Pressable
                onPress={() => moveProcessStep(step.id, 1)}
                disabled={index === (processSection.steps || []).length - 1}
              >
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={index === (processSection.steps || []).length - 1 ? c.textMuted : c.textPrimary}
                />
              </Pressable>
              <Pressable onPress={() => removeProcessStep(step.id)}>
                <Ionicons name="trash-outline" size={20} color={c.error} />
              </Pressable>
            </View>
          </View>
          <AdminToggleRow
            title="Show step"
            value={step.enabled !== false}
            onValueChange={(enabled) => updateProcessStep(step.id, { enabled })}
          />
          <PremiumInput
            label="Step title"
            value={step.title || ""}
            onChangeText={(title) => updateProcessStep(step.id, { title })}
          />
          <PremiumInput
            label="Description"
            value={step.description || ""}
            onChangeText={(description) => updateProcessStep(step.id, { description })}
            multiline
            numberOfLines={3}
          />
          <PremiumButton
            label={uploadingKey === `process-${step.id}` ? "Uploading…" : "Upload step image"}
            variant="outline"
            iconLeft="cloud-upload-outline"
            onPress={() => uploadProcessStepImage(step)}
            disabled={uploadingKey === `process-${step.id}`}
          />
        </View>
      ))}

      <View style={styles.row}>
        <PremiumButton label="Add step" variant="outline" iconLeft="add" onPress={addProcessStep} />
      </View>

      <Text style={[styles.blockTitle, styles.blockTitleSpaced]}>Compare ghee (web)</Text>
      <Text style={styles.blockHint}>
        “Ours vs ordinary ghee” cinematic compare — story opener, scenes, and side-by-side images.
      </Text>

      <AdminToggleRow
        title="Show compare section"
        subtitle="Cinematic KankreG vs ordinary block after the process journey"
        value={compareSection.enabled !== false}
        onValueChange={(enabled) => updateCompare({ enabled })}
      />

      <PremiumInput
        label="Eyebrow"
        value={compareSection.eyebrow || ""}
        onChangeText={(eyebrow) => updateCompare({ eyebrow })}
      />
      <PremiumInput
        label="Section title"
        value={compareSection.title || ""}
        onChangeText={(title) => updateCompare({ title })}
      />
      <PremiumInput
        label="Subtitle"
        value={compareSection.subtitle || ""}
        onChangeText={(subtitle) => updateCompare({ subtitle })}
        multiline
        numberOfLines={2}
      />
      <PremiumInput
        label="Story chapter"
        value={compareSection.storyChapter || ""}
        onChangeText={(storyChapter) => updateCompare({ storyChapter })}
        placeholder="Chapter II"
      />
      <PremiumInput
        label="Opening line"
        value={compareSection.openingLine || ""}
        onChangeText={(openingLine) => updateCompare({ openingLine })}
        multiline
        numberOfLines={2}
      />
      <PremiumInput
        label="Closing tagline"
        value={compareSection.closingTagline || ""}
        onChangeText={(closingTagline) => updateCompare({ closingTagline })}
        placeholder="A2 milk · Bilona-churned · open-grazed · hand-poured."
      />
      <PremiumInput
        label="Film label"
        value={compareSection.filmLabel || ""}
        onChangeText={(filmLabel) => updateCompare({ filmLabel })}
      />
      <View style={styles.row}>
        <View style={{ flex: 1, minWidth: 140 }}>
          <PremiumInput
            label="Ours column label"
            value={compareSection.oursLabel || ""}
            onChangeText={(oursLabel) => updateCompare({ oursLabel })}
          />
        </View>
        <View style={{ flex: 1, minWidth: 140 }}>
          <PremiumInput
            label="Ordinary column label"
            value={compareSection.ordinaryLabel || ""}
            onChangeText={(ordinaryLabel) => updateCompare({ ordinaryLabel })}
          />
        </View>
      </View>

      {(compareSection.rows || []).map((row, index) => (
        <View key={row.id} style={[styles.card, { borderColor: c.border }]}>
          <View style={styles.cardTop}>
            <View style={styles.comparePreviewPair}>
              {row.oursImageUrl ? (
                <Image source={{ uri: row.oursImageUrl }} style={styles.compareThumb} contentFit="cover" />
              ) : (
                <View style={styles.compareThumbEmpty}>
                  <Text style={styles.compareThumbLabel}>Ours</Text>
                </View>
              )}
              {row.ordinaryImageUrl ? (
                <Image source={{ uri: row.ordinaryImageUrl }} style={styles.compareThumb} contentFit="cover" />
              ) : (
                <View style={styles.compareThumbEmpty}>
                  <Text style={styles.compareThumbLabel}>Ord.</Text>
                </View>
              )}
            </View>
            <View style={styles.cardMeta}>
              <Text style={[styles.cardLabel, { color: c.textPrimary }]}>Scene {index + 1}</Text>
              <View style={styles.row}>
                <Pressable onPress={() => moveCompareRow(row.id, -1)} style={styles.iconBtn}>
                  <Ionicons name="arrow-up" size={18} color={c.textSecondary} />
                </Pressable>
                <Pressable onPress={() => moveCompareRow(row.id, 1)} style={styles.iconBtn}>
                  <Ionicons name="arrow-down" size={18} color={c.textSecondary} />
                </Pressable>
                <Pressable onPress={() => removeCompareRow(row.id)} style={styles.iconBtn}>
                  <Ionicons name="trash-outline" size={18} color="#b45309" />
                </Pressable>
              </View>
            </View>
          </View>

          <PremiumInput
            label="Row label"
            value={row.label || ""}
            onChangeText={(label) => updateCompareRow(row.id, { label })}
            placeholder="Milk source"
          />
          <PremiumInput
            label="KankreG copy"
            value={row.ours || ""}
            onChangeText={(ours) => updateCompareRow(row.id, { ours })}
            multiline
            numberOfLines={2}
          />
          <PremiumInput
            label="Ordinary copy"
            value={row.ordinary || ""}
            onChangeText={(ordinary) => updateCompareRow(row.id, { ordinary })}
            multiline
            numberOfLines={2}
          />
          <View style={styles.row}>
            <PremiumButton
              label="KankreG image"
              size="sm"
              variant="secondary"
              iconLeft="image-outline"
              loading={uploadingKey === `${row.id}-oursImageUrl`}
              disabled={Boolean(uploadingKey)}
              onPress={() => uploadCompareImage(row, "oursImageUrl")}
            />
            <PremiumButton
              label="Ordinary image"
              size="sm"
              variant="secondary"
              iconLeft="image-outline"
              loading={uploadingKey === `${row.id}-ordinaryImageUrl`}
              disabled={Boolean(uploadingKey)}
              onPress={() => uploadCompareImage(row, "ordinaryImageUrl")}
            />
          </View>
          <AdminToggleRow
            title="Show on website"
            subtitle="Disabled rows are hidden from the compare section"
            value={row.enabled !== false}
            onValueChange={(enabled) => updateCompareRow(row.id, { enabled })}
            isLast
          />
        </View>
      ))}

      <PremiumButton label="Add compare row" variant="outline" iconLeft="add" onPress={addCompareRow} />
    </View>
  );
}

function createStyles(c) {
  return StyleSheet.create({
    wrap: {
      gap: spacing.sm,
    },
    blockTitle: {
      fontFamily: fonts.extrabold,
      fontSize: typography.bodySmall,
      letterSpacing: 0.35,
      textTransform: "uppercase",
      color: c.textPrimary,
    },
    blockTitleSpaced: {
      marginTop: spacing.lg,
    },
    blockHint: {
      fontFamily: fonts.medium,
      fontSize: typography.caption,
      lineHeight: 17,
      color: c.textMuted,
      marginBottom: spacing.xs,
    },
    card: {
      borderWidth: 1,
      borderRadius: radius.lg,
      padding: spacing.md,
      gap: spacing.sm,
      backgroundColor: c.surface,
    },
    cardTop: {
      flexDirection: "row",
      gap: spacing.md,
    },
    cardMeta: {
      flex: 1,
      minWidth: 0,
      gap: spacing.xs,
    },
    cardLabel: {
      fontFamily: fonts.bold,
      fontSize: typography.bodySmall,
    },
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.xs,
      alignItems: "center",
    },
    iconBtn: {
      width: 34,
      height: 34,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.surfaceMuted,
      ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
    },
    previewEmpty: {
      width: 88,
      height: 110,
      borderRadius: radius.md,
      backgroundColor: c.surfaceMuted,
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },
    previewImage: {
      width: 88,
      height: 110,
      borderRadius: radius.md,
    },
    previewVideoLabel: {
      fontSize: 10,
      fontFamily: fonts.medium,
      color: c.textMuted,
    },
    photoRow: {
      flexDirection: "row",
      gap: spacing.sm,
      borderWidth: 1,
      borderRadius: radius.md,
      padding: spacing.sm,
      alignItems: "flex-start",
    },
    photoThumb: {
      width: 72,
      height: 90,
      borderRadius: radius.sm,
    },
    photoFields: {
      flex: 1,
      minWidth: 0,
      gap: spacing.xs,
    },
    comparePreviewPair: {
      flexDirection: "row",
      gap: spacing.xs,
    },
    compareThumb: {
      width: 64,
      height: 80,
      borderRadius: radius.sm,
    },
    compareThumbEmpty: {
      width: 64,
      height: 80,
      borderRadius: radius.sm,
      backgroundColor: c.surfaceMuted,
      alignItems: "center",
      justifyContent: "center",
    },
    compareThumbLabel: {
      fontSize: 10,
      fontFamily: fonts.medium,
      color: c.textMuted,
    },
  });
}

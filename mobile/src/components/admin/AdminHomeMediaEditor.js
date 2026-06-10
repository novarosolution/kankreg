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
import { newCommunityPostId, newCompareRowId, newHeroSlideId } from "../../utils/homeViewMedia";

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

      <Text style={[styles.blockTitle, styles.blockTitleSpaced]}>About KankreG (web)</Text>
      <Text style={styles.blockHint}>Story, video, and photo gallery below products on home + about page.</Text>

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

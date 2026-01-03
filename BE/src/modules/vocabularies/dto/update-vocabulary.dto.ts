import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateVocabularyDto } from './create-vocabulary.dto';

export class UpdateVocabularyDto extends PartialType(
    OmitType(CreateVocabularyDto, ['vocabularySetId'] as const),
) { }
